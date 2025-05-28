import { Router, Request, Response } from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { TextractClient, StartDocumentAnalysisCommand, GetDocumentAnalysisCommand, Block } from "@aws-sdk/client-textract";
import { s3Client, BUCKET_NAME } from "../config/s3Client";
import OpenAI from "openai";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const textractClient = new TextractClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const HEADER_KEYWORDS = ["TRANSACTION DATE", "POSTING DATE", "ACTIVITY DESCRIPTION", "AMOUNT"];

interface Transaction {
    transactionDate: string;
    postingDate: string;
    description: string;
    amount: number;
    category?: string;
}

interface Category {
    name: string;
    total: number;
    transactions: Transaction[];
}

interface ExpenseData {
    categories: Category[];
    totalExpenses: number;
    averageExpense: number;
    numberOfTransactions: number;
}

const validateFileName = (fileName: string): boolean => {
    const pattern = /^[a-z]+_(credit|debit)_\d{2}_\d{2}\.pdf$/;
    return pattern.test(fileName.toLowerCase());
};

const analyzeDocument = async (bucketName: string, fileName: string) => {
    const startCommand = new StartDocumentAnalysisCommand({
        DocumentLocation: {
            S3Object: {
                Bucket: bucketName,
                Name: fileName
            }
        },
        FeatureTypes: ["TABLES"]
    });

    const { JobId } = await textractClient.send(startCommand);
    if (!JobId) throw new Error('No JobId returned from Textract');
    return JobId;
};

const waitForJob = async (jobId: string, interval: number = 5000): Promise<void> => {
    while (true) {
        const command = new GetDocumentAnalysisCommand({ JobId: jobId });
        const response = await textractClient.send(command);
        const status = response.JobStatus;

        if (status === 'SUCCEEDED') {
            return;
        }
        if (status === 'FAILED') {
            throw new Error(`Textract job ${jobId} failed`);
        }

        await new Promise(resolve => setTimeout(resolve, interval));
    }
};

const getAnalysisResults = async (jobId: string) => {
    let nextToken: string | undefined;
    let blocks: Block[] = [];

    do {
        const command = new GetDocumentAnalysisCommand({
            JobId: jobId,
            NextToken: nextToken
        });

        const response = await textractClient.send(command);
        if (response.Blocks) {
            blocks = blocks.concat(response.Blocks);
        }
        nextToken = response.NextToken;
    } while (nextToken);

    return blocks;
};

const reconstructTables = (blocks: Block[]) => {
    const blocksById = new Map(blocks.map(b => [b.Id, b]));
    const tables: string[][][] = [];

    for (const block of blocks) {
        if (block.BlockType !== 'TABLE') continue;

        const cells: Block[] = [];
        for (const rel of block.Relationships || []) {
            if (rel.Type === 'CHILD') {
                for (const cellId of rel.Ids || []) {
                    const cell = blocksById.get(cellId);
                    if (cell?.BlockType === 'CELL') {
                        cells.push(cell);
                    }
                }
            }
        }

        const tableData: { [key: number]: { [key: number]: string } } = {};
        const maxRow = Math.max(...cells.map(c => c.RowIndex || 0));
        const maxCol = Math.max(...cells.map(c => c.ColumnIndex || 0));

        for (const cell of cells) {
            const row = cell.RowIndex || 0;
            const col = cell.ColumnIndex || 0;
            const words: string[] = [];

            for (const rel of cell.Relationships || []) {
                if (rel.Type === 'CHILD') {
                    for (const wordId of rel.Ids || []) {
                        const word = blocksById.get(wordId);
                        if (word?.BlockType === 'WORD' && word.Text) {
                            words.push(word.Text);
                        }
                    }
                }
            }

            if (!tableData[row]) tableData[row] = {};
            tableData[row][col] = words.join(' ');
        }

        const rows = Array.from({ length: maxRow }, (_, i) =>
            Array.from({ length: maxCol }, (_, j) =>
                tableData[i + 1]?.[j + 1] || ''
            )
        );

        tables.push(rows);
    }

    return tables;
};

const isHeader = (row: string[]): boolean => {
    const text = row.join(' ').toUpperCase();
    return HEADER_KEYWORDS.every(keyword => text.includes(keyword));
};

const extractTransactions = (tables: string[][][]): Transaction[] => {
    const transactions: Transaction[] = [];

    for (const table of tables) {
        if (table.length === 0) continue;

        const header = table[0];
        if (!isHeader(header)) continue;

        const cols = header.map(h => h.replace(/\(.*?\)/, '').toUpperCase().trim());
        const dateIdx = cols.findIndex(c => c.includes('TRANSACTION DATE'));
        const postingIdx = cols.findIndex(c => c.includes('POSTING DATE'));
        const descIdx = cols.findIndex(c => c.includes('ACTIVITY DESCRIPTION'));
        const amountIdx = cols.findIndex(c => c.includes('AMOUNT'));

        if (dateIdx === -1 || postingIdx === -1 || descIdx === -1 || amountIdx === -1) continue;

        for (let i = 1; i < table.length; i++) {
            const row = table[i];
            const description = row[descIdx].toUpperCase();

            // Skip payment, balance, and empty rows
            if (description === 'PAYMENT THANK YOU' ||
                description.includes('PREVIOUS STATEMENT BALANCE') ||
                description.includes('TOTAL NEW BALANCE') ||
                !description.trim()) {
                continue;
            }

            const cleanDescription = row[descIdx].split('FOREIGN CURRENCY')[0].trim();
            const amount = parseFloat(row[amountIdx].replace(/[$,]/g, ''));

            if (isNaN(amount)) continue;

            transactions.push({
                transactionDate: row[dateIdx].trim(),
                postingDate: row[postingIdx].trim(),
                description: cleanDescription,
                amount: amount
            });
        }
    }

    return transactions;
};

const categorizeTransaction = async (description: string, categories: string[]): Promise<string> => {
    const systemPrompt = 'You are a transaction classifier. Given a single bank-transaction description, pick the single best category from the provided list. Reply with exactly that category name.';
    const userPrompt = `Categories: ${categories.join(', ')}\nDescription: ${description}\nCategory:`;

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0
    });

    return response.choices[0].message.content?.trim() || categories[0];
};

router.post(
    '/upload',
    upload.single("file"),
    async (req: Request, res: Response): Promise<void> => {
        if (!req.file) {
            res.status(400).json({ message: "No file provided" });
            return;
        }

        const fileName = req.file.originalname;
        if (!validateFileName(fileName)) {
            res.status(400).json({
                message: "Invalid file name format. Expected format: bankname_statemnt-type_MM_YY.pdf"
            });
            return;
        }

        try {
            // Upload to S3
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME || '',
                Key: fileName,
                Body: req.file.buffer,
                ContentType: 'application/pdf'
            });

            await s3Client.send(command);

            // Start Textract analysis
            const jobId = await analyzeDocument(BUCKET_NAME || '', fileName);

            // Wait for job to complete
            await waitForJob(jobId);

            // Get analysis results
            const blocks = await getAnalysisResults(jobId);

            // Reconstruct tables and extract transactions
            const tables = reconstructTables(blocks);
            const transactions = extractTransactions(tables);

            // Get categories from request
            const categories = (req.body.categories || []) as string[];

            // Categorize transactions if categories are provided
            if (categories.length > 0) {
                // Get unique descriptions to avoid redundant API calls
                const uniqueDescriptions = new Set(transactions.map(t => t.description));
                const categoryMap = new Map<string, string>();

                // Categorize each unique description
                for (const description of uniqueDescriptions) {
                    const category = await categorizeTransaction(description, categories);
                    categoryMap.set(description, category);
                }

                // Assign categories to transactions
                transactions.forEach(transaction => {
                    transaction.category = categoryMap.get(transaction.description);
                });
            }

            // Transform data into ExpenseData format
            const categoryMap = new Map<string, Category>();

            // Initialize categories
            categories.forEach(categoryName => {
                categoryMap.set(categoryName, {
                    name: categoryName,
                    total: 0,
                    transactions: []
                });
            });

            // Group transactions by category
            transactions.forEach(transaction => {
                if (transaction.category) {
                    const category = categoryMap.get(transaction.category);
                    if (category) {
                        category.transactions.push(transaction);
                        category.total += transaction.amount;
                    }
                }
            });

            // Calculate totals
            const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
            const numberOfTransactions = transactions.length;
            const averageExpense = numberOfTransactions > 0 ? totalExpenses / numberOfTransactions : 0;

            const expenseData: ExpenseData = {
                categories: Array.from(categoryMap.values()),
                totalExpenses,
                averageExpense,
                numberOfTransactions
            };

            res.json({
                message: "File uploaded and analyzed successfully",
                fileName: fileName,
                jobId: jobId,
                expenseData
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                message: "Failed to process file",
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
);

export default router;