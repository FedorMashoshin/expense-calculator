import type { TooltipItem } from "chart.js";

export const chartConfigs = {
    pie: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    boxWidth: 12,
                    padding: 10,
                    font: { size: 11 },
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem<"pie">) => {
                        const label = tooltipItem.dataset.label || "";
                        return `${label}: ${parseFloat(tooltipItem.raw as string).toFixed(0)}$`;
                    },
                },
            },
        },
    },
    bar: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    boxWidth: 12,
                    padding: 10,
                    font: { size: 11 },
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem<"bar">) => {
                        const label = tooltipItem.dataset.label || "";
                        return `${label}: ${parseFloat(tooltipItem.raw as string).toFixed(0)}`;
                    },
                },
            },
        },
    },
    line: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    boxWidth: 12,
                    padding: 10,
                    font: { size: 11 },
                },
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItem: TooltipItem<"line">[]) => tooltipItem[0].label,
                    label: (tooltipItem: TooltipItem<"line">) => {
                        const label = tooltipItem.dataset.label || "";
                        return `${label}: ${parseFloat(tooltipItem.raw as string).toFixed(0)}$`;
                    },
                },
            },
        },
    },
}; 