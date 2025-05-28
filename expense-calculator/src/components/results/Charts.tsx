import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import type { ChartsProps } from "../../types/expense";
import { CHART_COLORS } from "../../types/colors";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Charts: React.FC<ChartsProps> = ({ categories }) => {
    const chartData = {
        labels: categories.map((item) => item.name),
        datasets: [
            {
                data: categories.map((item) => item.total),
                backgroundColor: [
                    CHART_COLORS.primary,
                    CHART_COLORS.cyan,
                    CHART_COLORS.accent,
                    CHART_COLORS.blue,
                    CHART_COLORS.green,
                    CHART_COLORS.purple,
                    CHART_COLORS.pink,
                    CHART_COLORS.teal,
                    CHART_COLORS.yellow,
                    CHART_COLORS.red,
                    CHART_COLORS.indigo,
                    CHART_COLORS.secondary,
                ],
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
                backgroundColor: CHART_COLORS.blue,
                borderColor: CHART_COLORS.blue,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    boxWidth: 12,
                    padding: 10,
                    font: {
                        size: 11,
                    },
                },
            },
        },
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-dark-900 mb-4">Expense Distribution</h4>
                <div className="h-[300px]">
                    <Pie data={chartData} options={options} />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-lg font-medium text-dark-900 mb-4">Expense Comparison</h4>
                <div className="h-[300px]">
                    <Bar data={barData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default Charts;
