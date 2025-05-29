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
        if (transaction.category) {
            const category = categoryMap.get(transaction.category);
            if (category) {
                category.transactions.push(transaction);
                category.total += transaction.amount;
            } else {
                // Handle transactions with categories not in the initial list if necessary
                // For now, we'll just add them, but they won't be in the initially provided categories array
                if (!categoryMap.has(transaction.category)) {
                    categoryMap.set(transaction.category, {
                        name: transaction.category,
                        total: 0,
                        transactions: []
                    });
                }
                const newCategory = categoryMap.get(transaction.category);
                if (newCategory) { // Check again after potentially adding
                    newCategory.transactions.push(transaction);
                    newCategory.total += transaction.amount;
                }
            }
        }
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