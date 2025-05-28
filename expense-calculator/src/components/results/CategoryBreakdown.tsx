import React, { useState } from "react";
import type { Category } from "../../types/expense";

interface CategoryBreakdownProps {
    categories: Category[];
}

// Helper function to parse "Month Day" format and add current year
const parseMonthDayDate = (dateString: string): Date | "Invalid Date" => {
    const parts = dateString.split(" ");
    if (parts.length !== 2) {
        return "Invalid Date";
    }
    const month = parts[0];
    const day = parts[1];

    const monthNames: { [key: string]: number } = {
        JAN: 0,
        FEB: 1,
        MAR: 2,
        APR: 3,
        MAY: 4,
        JUN: 5,
        JUL: 6,
        AUG: 7,
        SEP: 8,
        OCT: 9,
        NOV: 10,
        DEC: 11,
    };

    const monthIndex = monthNames[month.toUpperCase()];
    const dayNumber = parseInt(day, 10);

    if (monthIndex === undefined || isNaN(dayNumber)) {
        return "Invalid Date";
    }

    // Use the current year. This might need adjustment if statements span across years.
    const currentYear = new Date().getFullYear();

    // Create a Date object (monthIndex is 0-based)
    const date = new Date(currentYear, monthIndex, dayNumber);

    // Basic validation to check if the date is valid (e.g., not Feb 30)
    if (date.getFullYear() !== currentYear || date.getMonth() !== monthIndex || date.getDate() !== dayNumber) {
        return "Invalid Date";
    }

    return date;
};

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    // console.log(categories);
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
                                {item.total > 0 && <p className="text-sm text-neutral-500">{item.percentage.toFixed(0)}% of total</p>}
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
                                            const date = parseMonthDayDate(transaction.transactionDate);
                                            const displayDate = date === "Invalid Date" ? "Invalid Date" : date.toLocaleDateString();
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
