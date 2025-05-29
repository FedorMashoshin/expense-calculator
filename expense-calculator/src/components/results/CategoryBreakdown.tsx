import React, { useState } from "react";
import type { Category } from "../../types/expense";

interface CategoryBreakdownProps {
    categories: Category[];
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    return (
        <>
            <h4 className="text-lg font-medium text-neutral-900 mb-4">Category Breakdown</h4>
            <div className="space-y-3">
                {categories.map((item, index) => (
                    <div key={index} className="bg-neutral-50 rounded-lg overflow-hidden">
                        <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-100 transition-colors duration-200"
                            onClick={() => setExpandedCategory(expandedCategory === item.name ? null : item.name)}
                        >
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-neutral-900 truncate">{item.name}</p>
                                {item.total > 0 && <p className="text-sm text-neutral-500">{item.percentage?.toFixed(0)}% of total</p>}
                            </div>
                            <div className="flex items-center flex-shrink-0 ml-4">
                                <p className="text-lg font-semibold text-dark-800 mr-2">${item.total.toFixed(2)}</p>
                                <svg
                                    className={`w-5 h-5 text-neutral-500 transform transition-all duration-500 ease-in-out ${expandedCategory === item.name ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <div className={`grid transition-all duration-500 ease-in-out ${expandedCategory === item.name ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                            <div className="overflow-hidden">
                                <div className="border-t border-neutral-200 p-3 bg-white">
                                    <div className="space-y-2">
                                        {item.transactions.map((transaction, tIndex) => {
                                            const date = new Date(transaction.transactionDate);
                                            const displayDate = date.toLocaleDateString();
                                            return (
                                                <div
                                                    key={tIndex}
                                                    className="flex justify-between items-center text-sm transform transition-all duration-500 ease-in-out"
                                                    style={{
                                                        transform: expandedCategory === item.name ? "translateY(0)" : "translateY(-20px)",
                                                        opacity: expandedCategory === item.name ? 1 : 0,
                                                    }}
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-neutral-900 truncate">{transaction.description}</p>
                                                        <p className="text-neutral-500">{displayDate}</p>
                                                    </div>
                                                    <p className="font-medium text-dark-800 ml-4 flex-shrink-0">${transaction.amount.toFixed(2)}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CategoryBreakdown;
