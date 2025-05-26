import React from "react";

interface SummaryCardsProps {
    totalExpenses: number;
    averageExpense: number;
    numberOfTransactions: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ totalExpenses, averageExpense, numberOfTransactions }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h4>
                <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Average Expense</h4>
                <p className="text-2xl font-bold text-gray-900">${averageExpense.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Number of Transactions</h4>
                <p className="text-2xl font-bold text-gray-900">{numberOfTransactions}</p>
            </div>
        </div>
    );
};

export default SummaryCards;
