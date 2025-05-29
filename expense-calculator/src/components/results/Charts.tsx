import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from "chart.js";
import type { ChartsProps, Transaction } from "../../types/expense";
import { CHART_COLORS } from "../../types/colors";
import { PieChart, BarChart, LineChart } from "./charts/components";
import { useSpendingData, useDayOfWeekData } from "./charts/hooks";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const Charts: React.FC<ChartsProps> = ({ categories }) => {
    const allTransactions = categories.reduce((acc, category) => acc.concat(category.transactions), [] as Transaction[]);
    const { spendingByDate, sortedDates, formattedLabels, cumulativeData } = useSpendingData(allTransactions);
    const { spendingByDayOfWeek, transactionsPerDay } = useDayOfWeekData(allTransactions);

    const pieData = {
        labels: categories.map((item) => item.name),
        datasets: [
            {
                data: categories.map((item) => item.total),
                backgroundColor: Object.values(CHART_COLORS),
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: categories.map((item) => item.name),
        datasets: [
            {
                label: "Amount ($)",
                data: categories.map((item) => item.total),
                backgroundColor: CHART_COLORS.green,
                borderColor: CHART_COLORS.green,
                borderWidth: 1,
            },
        ],
    };

    const dailyLineData = {
        labels: formattedLabels,
        datasets: [
            {
                label: "Daily Spending ($)",
                data: sortedDates.map((dateString) => spendingByDate[dateString] || 0),
                borderColor: CHART_COLORS.red,
                backgroundColor: CHART_COLORS.red,
                tension: 0.1,
                fill: false,
            },
        ],
    };

    const cumulativeLineData = {
        labels: formattedLabels,
        datasets: [
            {
                label: "Cumulative Spending ($)",
                data: cumulativeData,
                borderColor: CHART_COLORS.blue,
                backgroundColor: CHART_COLORS.blue,
                tension: 0.1,
                fill: false,
            },
        ],
    };

    const dayOfWeekData = {
        labels: Object.keys(spendingByDayOfWeek),
        datasets: [
            {
                label: "Total Spending by Day of Week ($)",
                data: Object.values(spendingByDayOfWeek),
                backgroundColor: CHART_COLORS.purple,
                borderColor: CHART_COLORS.purple,
                borderWidth: 1,
            },
        ],
    };

    const transactionsPerWeekData = {
        labels: Object.keys(transactionsPerDay),
        datasets: [
            {
                label: "Total Transactions by Day of Week",
                data: Object.values(transactionsPerDay),
                backgroundColor: CHART_COLORS.teal,
                borderColor: CHART_COLORS.teal,
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-dark-900 mb-4">Expense Distribution</h4>
                <PieChart data={pieData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-dark-900 mb-4">Expense Comparison</h4>
                <BarChart data={barData} />
            </div>
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-dark-900 mb-4">Daily Spending Over Time</h4>
                <LineChart data={dailyLineData} />
            </div>
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-dark-900 mb-4">Cumulative Spending Over Time</h4>
                <LineChart data={cumulativeLineData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-dark-900 mb-4">Total Spending by Day of Week</h4>
                <BarChart data={dayOfWeekData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-dark-900 mb-4">Total Transactions by Day of Week</h4>
                <BarChart data={transactionsPerWeekData} />
            </div>
        </div>
    );
};

export default Charts;
