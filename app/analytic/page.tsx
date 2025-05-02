"use client";

import React from "react";
import { AreaChartStacked } from "@/components/charts/AreaChartStacked";
import { BarChartMultiple } from "@/components/charts/BarChartMultiple";
import { LineChartMultiple } from "@/components/charts/LineChartMultiple";
import { PieChartDonut } from "@/components/charts/PieChartDonut";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/utils";
import { getYearRange, getTrendingPercentage } from "@/lib/utils";

const transactions: Transaction[] = [
    {
        label: "Order #1001",
        note: "iPhone 15 Pro",
        category: "Electronics",
        type: "income",
        amount: 1299,
        date: "2025-04-01",
    },
    {
        label: "Warehouse Rent",
        note: "April",
        category: "Operations",
        type: "expense",
        amount: 2400,
        date: "2025-04-02",
    },
    {
        label: "Employee Salary",
        note: "Manager",
        category: "HR",
        type: "expense",
        amount: 1800,
        date: "2025-04-03",
    },
    {
        label: "Order #1002",
        note: "Gaming Chair",
        category: "Furniture",
        type: "income",
        amount: 299,
        date: "2025-04-04",
    },
    {
        label: "Logistics",
        note: "FedEx April",
        category: "Delivery",
        type: "expense",
        amount: 720,
        date: "2025-04-05",
    },
    {
        label: "Order #1003",
        note: "Monitor 4K",
        category: "Electronics",
        type: "income",
        amount: 549,
        date: "2025-04-06",
    },
    {
        label: "Employee Salary",
        note: "Warehouse",
        category: "HR",
        type: "expense",
        amount: 1400,
        date: "2025-04-07",
    },
    {
        label: "Order #1004",
        note: "Laptop",
        category: "Electronics",
        type: "income",
        amount: 999,
        date: "2025-04-08",
    },
    {
        label: "Utility Bills",
        note: "April",
        category: "Operations",
        type: "expense",
        amount: 300,
        date: "2025-04-09",
    },
    {
        label: "Order #1005",
        note: "Headphones",
        category: "Electronics",
        type: "income",
        amount: 199,
        date: "2025-04-10",
    },
];

const transactionsArea: Transaction[] = [
    { label: "Order #1001", note: "Product A", category: "Sales", type: "income", amount: 500, date: "2025-01-01" },
    { label: "Order #1002", note: "Product B", category: "Sales", type: "income", amount: 750, date: "2025-01-15" },
    { label: "Order #1003", note: "Product C", category: "Sales", type: "income", amount: 300, date: "2025-02-01" },
    { label: "Rent", note: "Office", category: "Operations", type: "expense", amount: 1000, date: "2025-02-05" },
    { label: "Order #1004", note: "Product D", category: "Sales", type: "income", amount: 600, date: "2025-02-20" },
    { label: "Salary", note: "Employee", category: "HR", type: "expense", amount: 1200, date: "2025-03-01" },
    { label: "Order #1005", note: "Product E", category: "Sales", type: "income", amount: 900, date: "2025-03-10" },
    { label: "Utilities", note: "Monthly", category: "Operations", type: "expense", amount: 400, date: "2025-03-15" },
    { label: "Order #1006", note: "Product F", category: "Sales", type: "income", amount: 650, date: "2025-04-01" },
    { label: "Order #1007", note: "Product G", category: "Sales", type: "income", amount: 850, date: "2025-04-10" },
    { label: "Salary", note: "Employee", category: "HR", type: "expense", amount: 1300, date: "2025-04-15" },
    { label: "Order #1008", note: "Product H", category: "Sales", type: "income", amount: 400, date: "2025-05-01" },
    { label: "Maintenance", note: "Office", category: "Operations", type: "expense", amount: 300, date: "2025-05-05" },
    { label: "Order #1009", note: "Product I", category: "Sales", type: "income", amount: 700, date: "2025-05-20" },
    { label: "Salary", note: "Employee", category: "HR", type: "expense", amount: 1250, date: "2025-06-01" },
    { label: "Order #1010", note: "Product J", category: "Sales", type: "income", amount: 800, date: "2025-06-10" },
];

const lineChartData = [
    { date: "2025-04-01", desktop: 220, mobile: 150 },
    { date: "2025-04-02", desktop: 190, mobile: 160 },
    { date: "2025-04-03", desktop: 240, mobile: 170 },
    { date: "2025-04-04", desktop: 260, mobile: 190 },
    { date: "2025-04-05", desktop: 250, mobile: 200 },
    { date: "2025-04-06", desktop: 230, mobile: 210 },
    { date: "2025-04-07", desktop: 210, mobile: 180 },
    { date: "2025-04-08", desktop: 270, mobile: 220 },
    { date: "2025-04-09", desktop: 200, mobile: 190 },
    { date: "2025-04-10", desktop: 240, mobile: 210 },
];

const AnalyticPage: React.FC = () => {
    // Вычисляем динамический годовой диапазон и тренды для разных метрик
    const yearRangeArea = getYearRange(transactionsArea);
    const trendIncomeArea = getTrendingPercentage(transactionsArea, "income").toFixed(1);

    const yearRangeBar = getYearRange(transactions);
    const trendIncomeBar = getTrendingPercentage(transactions, "income").toFixed(1);

    const yearRangeLine = getYearRange(lineChartData.map((d) => ({ date: d.date, label: "", note: "", category: "", type: "income", amount: 0 })));
    const trendIncomeLine = getTrendingPercentage(
        lineChartData.map((d) => ({ date: d.date, label: "", note: "", category: "", type: "income", amount: d.desktop })),
        "income"
    ).toFixed(1);

    const yearRangePie = "January – June 2025";
    const trendOrdersPie = "5.2";

    return (
        <div className="flex flex-col gap-10 p-8">
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                <AreaChartStacked data={transactionsArea} />
                <BarChartMultiple data={transactions} />
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle>Top Spending Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm leading-relaxed">
                                <li>📦 Operations — $2400</li>
                                <li>👨‍💼 HR — $3200</li>
                                <li>🚚 Delivery — $720</li>
                            </ul>
                        </CardContent>
                        <div className="p-4 text-xs text-muted-foreground">
                            {yearRangeBar}
                            <br />
                            Trending up by {trendIncomeBar}% this month
                        </div>
                    </Card>
                    <PieChartDonut />
                </div>
                <LineChartMultiple data={lineChartData} />
            </div>
        </div>
    );
};

export default AnalyticPage;
