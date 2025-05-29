export function formatDateWithDay(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    return `${year}-${month}-${day} (${dayOfWeek})`;
};