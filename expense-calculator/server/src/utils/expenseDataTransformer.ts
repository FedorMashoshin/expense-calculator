import { Category, ExpenseData, Transaction } from "../types/expense";

export function transformTransactionsToExpenseData(
    transactions: Transaction[],
    categories: string[]
): ExpenseData {
    const categoryMap = new Map<string, Category>();

    // Initialize categories based on the provided list
    categories.forEach(categoryName => {
        categoryMap.set(categoryName, {
            name: categoryName,
            total: 0,
            transactions: []
        });
    });

    // Group transactions by category and calculate category totals
    transactions.forEach(transaction => {
        const categoryName = transaction.category || 'Uncategorized';
        if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, {
                name: categoryName,
                total: 0,
                transactions: []
            });
        }
        const category = categoryMap.get(categoryName)!;
        category.transactions.push(transaction);
        category.total += transaction.amount;
    });

    // Calculate overall totals
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
    const numberOfTransactions = transactions.length;
    const averageExpense = numberOfTransactions > 0 ? totalExpenses / numberOfTransactions : 0;

    const expenseData: ExpenseData = {
        categories: Array.from(categoryMap.values()),
        totalExpenses,
        averageExpense,
        numberOfTransactions
    };

    return expenseData;
} 