export function parseMonthDayDate(dateString: string): Date | "Invalid Date" {
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
    if (monthIndex === undefined) {
        return "Invalid Date";
    }

    const dayNumber = parseInt(day);
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
        return "Invalid Date";
    }

    const date = new Date();
    date.setMonth(monthIndex);
    date.setDate(dayNumber);

    return date;
}