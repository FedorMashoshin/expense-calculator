export interface Transaction {
    transactionDate: string;
    postingDate: string;
    description: string;
    amount: number;
    category?: string;
}

export interface Category {
    name: string;
    total: number;
    percentage?: number; // Added percentage here, as it's calculated on frontend but part of the data structure
    transactions: Transaction[];
}

export interface ExpenseData {
    categories: Category[];
    totalExpenses: number;
    averageExpense: number;
    numberOfTransactions: number;
}