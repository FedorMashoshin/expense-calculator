import React from "react";
import SummaryCards from "./SummaryCards";
import Charts from "./Charts";
import CategoryBreakdown from "./CategoryBreakdown";
import type { ResultsProps } from "../../types/expense";

const Results: React.FC<ResultsProps> = ({ categories, totalExpenses, averageExpense, numberOfTransactions }) => {
    return (
        <div className="space-y-6">
            <SummaryCards totalExpenses={totalExpenses} averageExpense={averageExpense} numberOfTransactions={numberOfTransactions} />
            <div className="bg-white p-6 rounded-lg shadow">
                <CategoryBreakdown categories={categories} />
            </div>
            <Charts categories={categories} />
        </div>
    );
};

export default Results;
