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

export interface AvailableMonth {
    month: string;  // Format: "YYYY-MM"
    fileName: string;
    uploadDate: string;
    totalExpenses: number;
}

// Dummy data for available months
export const dummyAvailableMonths: AvailableMonth[] = [
    {
        month: "2024-03",
        fileName: "td_credit_03_24.pdf",
        uploadDate: "2024-03-25",
        totalExpenses: 2450.75
    },
    {
        month: "2024-02",
        fileName: "td_credit_02_24.pdf",
        uploadDate: "2024-02-25",
        totalExpenses: 2180.50
    },
    {
        month: "2024-01",
        fileName: "td_credit_01_24.pdf",
        uploadDate: "2024-01-25",
        totalExpenses: 1950.25
    }
];
