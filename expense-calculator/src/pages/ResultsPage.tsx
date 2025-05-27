import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Results from "../components/results/Results";
import type { ExpenseData } from "../types/expense";

// Dummy data for testing
const dummyExpenseData: ExpenseData = {
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
};

export default function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const expenseData = (location.state?.expenseData as ExpenseData) || dummyExpenseData;

    // If no data is available, redirect to upload page
    React.useEffect(() => {
        if (!expenseData) {
            navigate("/upload");
        }
    }, [expenseData, navigate]);

    if (!expenseData) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto mb-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Expense Analysis</h1>
                    <p className="mt-3 text-lg text-gray-600">Your expense breakdown and insights</p>
                </div>
            </div>
            <div className="w-[90vw] mx-auto">
                <Results
                    categories={expenseData.categories}
                    totalExpenses={expenseData.totalExpenses}
                    averageExpense={expenseData.averageExpense}
                    numberOfTransactions={expenseData.numberOfTransactions}
                />
            </div>
        </div>
    );
}
