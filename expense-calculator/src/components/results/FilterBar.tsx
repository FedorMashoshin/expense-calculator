import React from "react";

interface FilterBarProps {
    selectedMonth: number;
    selectedYear: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const FilterBar: React.FC<FilterBarProps> = ({ selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
    // Generate years array (current year and 2 years back)
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-1/2">
                    <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                        Month
                    </label>
                    <select
                        id="month"
                        value={selectedMonth}
                        onChange={(e) => onMonthChange(Number(e.target.value))}
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                        {months.map((month, index) => (
                            <option key={month} value={index + 1}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full sm:w-1/2">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                    </label>
                    <select
                        id="year"
                        value={selectedYear}
                        onChange={(e) => onYearChange(Number(e.target.value))}
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
