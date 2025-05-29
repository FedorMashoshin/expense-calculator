export interface ChartData {
    labels: string[];
    datasets: {
        label?: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string;
        borderWidth?: number;
        tension?: number;
        fill?: boolean;
    }[];
} 