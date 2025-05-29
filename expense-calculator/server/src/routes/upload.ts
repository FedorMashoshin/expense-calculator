import { Router, Request, Response } from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "../config/s3Client";
import { analyzeDocument, waitForJob, getAnalysisResults } from "../services/textractService";
import { reconstructTables, validateFileName, extractTransactions } from "../utils/textractDataProcessor";
import { transformTransactionsToExpenseData } from "../utils/expenseDataTransformer";
import { assignCategoriesToTransactions } from "../utils/transactionCategorizer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

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
            let transactions = extractTransactions(tables);

            // Get categories from request
            const categories = (req.body.categories || []) as string[];

            // Assign categories to transactions if categories are provided
            transactions = await assignCategoriesToTransactions(transactions, categories);

            // Transform data into ExpenseData format using the new function
            const expenseData = transformTransactionsToExpenseData(transactions, categories);

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