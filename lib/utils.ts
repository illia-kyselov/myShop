import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type Transaction = {
    label: string;
    note: string;
    category: string;
    type: "income" | "expense";
    amount: number;
    date: string;
};

export type AggregatedData = {
    date: string;
    income: number;
    expense: number;
    category: string;
}[];

export function aggregateData(data: Transaction[]): AggregatedData {
    const result: {
        [key: string]: { income: number; expense: number; category: string };
    } = {};

    data.forEach((item) => {
        const date = item.date;
        if (!result[date]) {
            result[date] = { income: 0, expense: 0, category: item.category };
        }
        if (item.type === "income") {
            result[date].income += item.amount;
        } else {
            result[date].expense += item.amount;
        }
    });

    return Object.entries(result).map(
        ([date, { income, expense, category }]) => ({
            date,
            income,
            expense,
            category
        })
    );
}

export function getYearRange(data: { date: string }[]): string {
    if (!data.length) return "";
    const dates = data.map((d) => new Date(d.date).getTime());
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dates));
    const options = { month: "long", year: "numeric" } as const;
    return `${min.toLocaleDateString("en-US", options)} - ${max.toLocaleDateString("en-US", options)}`;
}

export function getTrendingPercentage(data: { amount: number; date: string; }[], p0: string): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthData = data.filter((tx) => {
        const d = new Date(tx.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const previousMonthData = data.filter((tx) => {
        const d = new Date(tx.date);
        let month = d.getMonth();
        let year = d.getFullYear();
        if (currentMonth === 0) {
            return month === 11 && year === currentYear - 1;
        }
        return month === currentMonth - 1 && year === currentYear;
    });

    const currentTotal = currentMonthData.reduce((acc, tx) => acc + tx.amount, 0);
    const previousTotal = previousMonthData.reduce((acc, tx) => acc + tx.amount, 0);
    if (previousTotal === 0) return 0;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
}

export const filters = ["7D", "1M", "6M", "1Y", "All"];

export function filterData(data: Transaction[], filter: string): Transaction[] {
    const now = new Date();
    let startDate;

    switch (filter) {
        case "7D":
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case "1M":
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case "6M":
            startDate = new Date(now.setMonth(now.getMonth() - 6));
            break;
        case "1Y":
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        case "All":
            startDate = new Date(0);
            break;
        default:
            startDate = new Date(0);
    }

    return data
        .filter((item) => new Date(item.date) >= startDate)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
