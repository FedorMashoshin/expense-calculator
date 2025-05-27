import React from "react";
import { useNavigate } from "react-router-dom";
import type { AvailableMonth } from "../types/expense";

interface AvailableMonthsProps {
    months: AvailableMonth[];
}

export default function AvailableMonths({ months }: AvailableMonthsProps) {
    const navigate = useNavigate();

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleString("default", { month: "long", year: "numeric" });
    };

    return (
        <div className="bg-white p-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Statements</h3>
            <div className="space-y-3">
                {months.map((month) => (
                    <div
                        key={month.month}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        onClick={() => navigate(`/results?month=${month.month}`)}
                    >
                        <div>
                            <p className="font-medium text-gray-900">{formatMonth(month.month)}</p>
                            <p className="text-sm text-gray-500">Uploaded on {new Date(month.uploadDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-primary-600">${month.totalExpenses.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{month.fileName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
