import React from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import { chartConfigs } from "./config";
import type { ChartData } from "../../../types/chart";

export const PieChart: React.FC<{ data: ChartData }> = ({ data }) => (
    <div className="h-[300px]">
        <Pie data={data} options={chartConfigs.pie} />
    </div>
);

export const BarChart: React.FC<{ data: ChartData }> = ({ data }) => (
    <div className="h-[300px]">
        <Bar data={data} options={chartConfigs.bar} />
    </div>
);

export const LineChart: React.FC<{ data: ChartData }> = ({ data }) => (
    <div className="h-[300px]">
        <Line data={data} options={chartConfigs.line} />
    </div>
);
