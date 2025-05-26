import { useState } from "react";
import PDFUploader from "./components/pdfUploader";
import Results from "./components/results/Results";
import type { ExpenseData } from "./types/expense";

export default function App() {
    const defaultCategories = [
        "Housing",
        "Subscriptions",
        "Utilities & Services",
        "Groceries",
        "Dining Out",
        "Transportation",
        "Healthcare",
        "Investments & Wealth",
        "Personal & Family",
        "Entertainment & Recreation",
        "Household & Supplies",
        "Miscellaneous",
    ];

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"upload" | "results">("upload");
    const [expenseData, setExpenseData] = useState<ExpenseData | null>({
        // Temporary dummy data for testing
        categories: [
            {
                category: "Groceries",
                amount: 450.25,
                percentage: 18.4,
                transactions: [
                    { description: "Whole Foods Market", amount: 85.5, date: "2024-03-15" },
                    { description: "Trader Joe's", amount: 65.75, date: "2024-03-10" },
                    { description: "Safeway", amount: 120.3, date: "2024-03-05" },
                ],
            },
            {
                category: "Transportation",
                amount: 320.5,
                percentage: 13.1,
                transactions: [
                    { description: "Uber", amount: 45.0, date: "2024-03-14" },
                    { description: "Gas Station", amount: 75.5, date: "2024-03-12" },
                    { description: "Public Transit", amount: 35.0, date: "2024-03-08" },
                ],
            },
            {
                category: "Entertainment",
                amount: 280.0,
                percentage: 11.4,
                transactions: [
                    { description: "Movie Theater", amount: 45.0, date: "2024-03-13" },
                    { description: "Concert Tickets", amount: 120.0, date: "2024-03-07" },
                    { description: "Netflix Subscription", amount: 15.99, date: "2024-03-01" },
                ],
            },
            {
                category: "Utilities",
                amount: 175.3,
                percentage: 7.2,
                transactions: [
                    { description: "Electric Bill", amount: 85.3, date: "2024-03-15" },
                    { description: "Internet Bill", amount: 65.0, date: "2024-03-10" },
                    { description: "Water Bill", amount: 25.0, date: "2024-03-05" },
                ],
            },
            {
                category: "Dining Out",
                amount: 425.6,
                percentage: 17.4,
                transactions: [
                    { description: "Italian Restaurant", amount: 85.5, date: "2024-03-14" },
                    { description: "Coffee Shop", amount: 12.5, date: "2024-03-12" },
                    { description: "Sushi Place", amount: 65.0, date: "2024-03-09" },
                ],
            },
        ],
        totalExpenses: 2450.75,
        averageExpense: 204.23,
        numberOfTransactions: 15,
    });

    const handleUpload = async (file: File, categories: string[]) => {
        setLoading(true);
        setError(null);
        setExpenseData(null);

        const formData = new FormData();
        formData.append("file", file);
        categories.forEach((category) => formData.append("categories[]", category));

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }
            const json = await res.json();
            console.log("Received data from API:", json);
            setExpenseData(json);
            setActiveTab("results");
        } catch (err: unknown) {
            console.error("Upload failed:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    console.log("Current expenseData:", expenseData);
    console.log("Current activeTab:", activeTab);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Expense Calculator</h1>
                    <p className="mt-3 text-lg text-gray-600">Upload your bank statement to analyze your expenses</p>
                </div>
            </div>

            <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
                    <button
                        onClick={() => setActiveTab("upload")}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "upload" ? "bg-primary-500 text-white" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Upload
                    </button>
                    <button
                        onClick={() => setActiveTab("results")}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "results" ? "bg-primary-500 text-white" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        Results
                    </button>
                </div>
            </div>

            {activeTab === "upload" ? (
                <div className="max-w-xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <PDFUploader onUpload={handleUpload} defaultCategories={defaultCategories} />
                    </div>
                </div>
            ) : (
                <div className="w-[90vw] mx-auto">
                    {loading && (
                        <div className="p-4 text-center bg-white rounded-2xl shadow-xl">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-2 text-gray-600">Processing your file...</p>
                        </div>
                    )}
                    {error && (
                        <div className="p-4 bg-red-50 rounded-2xl shadow-xl">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                    {expenseData && !loading && !error && (
                        <Results
                            categories={expenseData.categories}
                            totalExpenses={expenseData.totalExpenses}
                            averageExpense={expenseData.averageExpense}
                            numberOfTransactions={expenseData.numberOfTransactions}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
