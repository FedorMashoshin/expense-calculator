import { useMemo, useState, useEffect } from "react";
import Results from "../components/results/Results";
import FilterBar from "../components/results/FilterBar";
import axios from "axios";

interface RawExpense {
    _id: string;
    amount: number;
    category: string;
    description: string;
    day: number;
    month: number;
    year: number;
    fileName: string;
    createdAt: string;
    updatedAt: string;
}

export default function ResultsPage() {
    const [expenseData, setExpenseData] = useState<RawExpense[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize with current month and year
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    // Fetch data from the database
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/expenses?month=${selectedMonth}&year=${selectedYear}`);
                setExpenseData(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch expense data");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedMonth, selectedYear]);

    // Process the fetched data
    const processedData = useMemo(() => {
        if (!expenseData) return null;

        // Group expenses by category
        const categoryMap = new Map();
        let totalExpenses = 0;
        const numberOfTransactions = expenseData.length;

        expenseData.forEach((expense) => {
            const category = expense.category || "Uncategorized";
            if (!categoryMap.has(category)) {
                categoryMap.set(category, {
                    name: category,
                    total: 0,
                    transactions: [],
                });
            }

            const categoryData = categoryMap.get(category);
            categoryData.total += expense.amount;
            categoryData.transactions.push({
                description: expense.description,
                amount: expense.amount,
                // TODO Change year from 2025 to proper year.
                // TODO TD doesn't provide year for us. As on option we can take that from statement header, not the transactions table.
                transactionDate: new Date(2025, expense.month - 1, expense.day),
                category: expense.category,
            });
            totalExpenses += expense.amount;
        });

        return {
            categories: Array.from(categoryMap.values()).map((category) => ({
                ...category,
                percentage: totalExpenses > 0 ? (category.total / totalExpenses) * 100 : 0,
            })),
            totalExpenses,
            averageExpense: numberOfTransactions > 0 ? totalExpenses / numberOfTransactions : 0,
            numberOfTransactions,
        };
    }, [expenseData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    if (!processedData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">No data available for the selected period</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto mb-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Expense Analysis</h1>
                    <p className="mt-3 text-lg text-gray-600">Your expense breakdown and insights</p>
                </div>
            </div>

            <FilterBar selectedMonth={selectedMonth} selectedYear={selectedYear} onMonthChange={setSelectedMonth} onYearChange={setSelectedYear} />

            <div className="w-[90vw] mx-auto">
                <Results
                    categories={processedData.categories}
                    totalExpenses={processedData.totalExpenses}
                    averageExpense={processedData.averageExpense}
                    numberOfTransactions={processedData.numberOfTransactions}
                />
            </div>
        </div>
    );
}
