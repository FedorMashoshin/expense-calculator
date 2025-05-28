import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Results from "../components/results/Results";
import type { ExpenseData } from "../types/expense";

export default function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    // Correctly type expenseDataFromLocation as it can be undefined
    const expenseDataFromLocation = location.state?.expenseData.expenseData as ExpenseData;

    console.log(expenseDataFromLocation);

    // Wrap the calculation in useMemo to ensure stability for useEffect dependencies
    const expenseDataToDisplay: ExpenseData | undefined = useMemo(() => {
        if (!expenseDataFromLocation) {
            // If no data from location, return undefined (or a minimal dummy data if preferred)
            return undefined; // or return dummyExpenseData;
        }

        // Process data from location: filter and calculate percentages
        return {
            ...expenseDataFromLocation,
            categories: expenseDataFromLocation.categories
                .filter((category) => category.total > 0)
                .map((category) => ({
                    ...category,
                    percentage: expenseDataFromLocation.totalExpenses > 0 ? (category.total / expenseDataFromLocation.totalExpenses) * 100 : 0,
                })),
        };
    }, [expenseDataFromLocation]); // Dependency: recalculate only when expenseDataFromLocation changes

    // If no data is available, redirect to upload page
    React.useEffect(() => {
        if (!expenseDataToDisplay) {
            // This check now correctly handles the undefined case
            navigate("/upload");
        }
    }, [expenseDataToDisplay, navigate]); // Dependencies: redirect when data presence changes or navigate function changes

    if (!expenseDataToDisplay) {
        // This check also correctly handles the undefined case
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
                    categories={expenseDataToDisplay.categories}
                    totalExpenses={expenseDataToDisplay.totalExpenses}
                    averageExpense={expenseDataToDisplay.averageExpense}
                    numberOfTransactions={expenseDataToDisplay.numberOfTransactions}
                />
            </div>
        </div>
    );
}
