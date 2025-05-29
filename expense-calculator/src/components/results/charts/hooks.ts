import type { Transaction } from "../../../types/expense";
import { parseMonthDayDate } from "../../../utils/TDMonthParsingHelper";
import { formatDateWithDay } from "../../../utils/TDDateWithDayFormatter";

export const useSpendingData = (transactions: Transaction[]) => {
    const spendingByDate: { [date: string]: number } = {};

    transactions.forEach((transaction) => {
        const date = parseMonthDayDate(transaction.transactionDate);
        if (date !== "Invalid Date") {
            const dateString = date.toISOString().split("T")[0];
            spendingByDate[dateString] = (spendingByDate[dateString] || 0) + transaction.amount;
        }
    });

    const sortedDates = Object.keys(spendingByDate).sort();
    const formattedLabels = sortedDates.map((dateString) => {
        const date = new Date(dateString + "T00:00:00");
        return formatDateWithDay(date);
    });

    let cumulativeSpending = 0;
    const cumulativeData = sortedDates.map((date) => {
        cumulativeSpending += spendingByDate[date];
        return cumulativeSpending;
    });

    return {
        spendingByDate,
        sortedDates,
        formattedLabels,
        cumulativeData,
    };
};

export const useDayOfWeekData = (transactions: Transaction[]) => {
    const spendingByDayOfWeek: { [key: string]: number } = {
        Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0,
        Thursday: 0, Friday: 0, Saturday: 0,
    };

    const transactionsPerDay: { [key: string]: number } = {
        Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0,
        Thursday: 0, Friday: 0, Saturday: 0,
    };

    transactions.forEach((transaction) => {
        const date = parseMonthDayDate(transaction.transactionDate);
        if (date !== "Invalid Date") {
            const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
            spendingByDayOfWeek[dayOfWeek] += transaction.amount;
            transactionsPerDay[dayOfWeek]++;
        }
    });

    return { spendingByDayOfWeek, transactionsPerDay };
}; 