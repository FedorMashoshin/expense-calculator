import { Block } from "@aws-sdk/client-textract";
import { Transaction } from "../types/expense";

export const validateFileName = (fileName: string): boolean => {
    const pattern = /^[a-z]+_(credit|debit)_\d{2}_\d{2}\.pdf$/;
    return pattern.test(fileName.toLowerCase());
};

const HEADER_KEYWORDS = ["TRANSACTION DATE", "POSTING DATE", "ACTIVITY DESCRIPTION", "AMOUNT"];

const isHeader = (row: string[]): boolean => {
    const text = row.join(' ').toUpperCase();
    return HEADER_KEYWORDS.every(keyword => text.includes(keyword));
};

export const reconstructTables = (blocks: Block[]) => {
    const blocksById = new Map<string, Block>(blocks.map(block => [block.Id!, block]));
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
        const maxRow = cells.length > 0 ? Math.max(...cells.map(c => c.RowIndex || 0)) : 0;
        const maxCol = cells.length > 0 ? Math.max(...cells.map(c => c.ColumnIndex || 0)) : 0;

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

export const extractTransactions = (tables: string[][][]): Transaction[] => {
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