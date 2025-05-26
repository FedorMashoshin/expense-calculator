export interface Transaction {
    description: string;
    amount: number;
    date: string;
}

export interface Category {
    category: string;
    amount: number;
    percentage: number;
    transactions: Transaction[];
}

export interface ExpenseData {
    categories: Category[];
    totalExpenses: number;
    averageExpense: number;
    numberOfTransactions: number;
}

export interface ResultsProps {
    categories: Category[];
    totalExpenses: number;
    averageExpense: number;
    numberOfTransactions: number;
}

export interface ChartsProps {
    categories: Category[];
}
