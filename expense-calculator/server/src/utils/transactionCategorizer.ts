import { categorizeTransaction } from "../services/openaiService";
import { Transaction } from "../types/expense";

export async function assignCategoriesToTransactions(
    transactions: Transaction[],
    categories: string[]
): Promise<Transaction[]> {
    if (categories.length === 0) {
        // If no categories provided, return transactions without categories
        return transactions.map(transaction => ({
            ...transaction,
            category: undefined
        }));
    }

    const uniqueDescriptions = new Set(transactions.map(t => t.description));
    const categoryMap = new Map<string, string>();

    // Categorize each unique description using the OpenAI service
    for (const description of uniqueDescriptions) {
        // Ensure we don't call OpenAI if description is empty or just whitespace
        if (description.trim()) {
            const category = await categorizeTransaction(description, categories);
            categoryMap.set(description, category);
        }
    }

    // Assign categories to transactions based on the categoryMap
    const categorizedTransactions = transactions.map(transaction => ({
        ...transaction,
        // Assign the category from the map, falling back to undefined if not found
        category: categoryMap.get(transaction.description)
    }));

    return categorizedTransactions;
}