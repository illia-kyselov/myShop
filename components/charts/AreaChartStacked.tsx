"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect } from "react";
import { Transaction, aggregateData, filterData, filters, getYearRange, getTrendingPercentage } from "@/lib/utils";

const chartConfig: ChartConfig = {
    income: {
        label: "Income",
        color: "hsl(var(--chart-1))",
    },
    expense: {
        label: "Expense",
        color: "hsl(var(--chart-2))",
    },
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "short" });
};

export function AreaChartStacked({ data }: { data: Transaction[] }) {
    const [selectedFilter, setSelectedFilter] = useState<string>("7D");
    const filteredData = useMemo(() => filterData(data, selectedFilter), [data, selectedFilter]);
    const chartData = aggregateData(filteredData);

    const [yearRange, setYearRange] = useState<string>("...");
    const [trendIncome, setTrendIncome] = useState<string>("...");

    useEffect(() => {
        setYearRange(getYearRange(filteredData));
        setTrendIncome(getTrendingPercentage(filteredData, "income").toFixed(1));
    }, [filteredData]);

    return (
        <Card className="p-2">
            <div className="flex gap-3 flex-wrap">
                {filters.map((filter) => (
                    <Button key={filter} variant={selectedFilter === filter ? "default" : "outline"} onClick={() => setSelectedFilter(filter)}>
                        {filter}
                    </Button>
                ))}
            </div>
            <CardHeader>
                <CardTitle>Area Chart - Stacked</CardTitle>
                <CardDescription>Showing total visitors for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                        <defs>
                            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatDate} />
                        <YAxis axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Area type="linear" dataKey="income" fill="url(#fillIncome)" stroke="hsl(var(--chart-1))" fillOpacity={0.4} stackId="a" />
                        <Area type="linear" dataKey="expense" fill="url(#fillExpense)" stroke="hsl(var(--chart-2))" fillOpacity={0.4} stackId="a" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending {parseFloat(trendIncome) >= 0 ? "up" : "down"} by {trendIncome}% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            {yearRange}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
