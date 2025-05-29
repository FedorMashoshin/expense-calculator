export interface Transaction {
    description: string;
    amount: number;
    transactionDate: string;
    category?: string;
}

export interface Category {
    name: string;
    total: number;
    percentage?: number;
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

export interface AvailableMonth {
    date: string;  // Format: "YYYY-MM"
    totalExpenses: number;
}

// Dummy data for available months
export const dummyAvailableMonths: AvailableMonth[] = [
    {
        date: "2024-03",
        totalExpenses: 2450.75
    },
    {
        date: "2024-02",
        totalExpenses: 2180.50
    },
    {
        date: "2024-01",
        totalExpenses: 1950.25
    }
];
