"use client";

import React, { useState, useEffect } from "react";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

interface Row {
    month: string;
    desktop: number;
    mobile: number;
}

const chartConfig: ChartConfig = {
    desktop: { label: "ПК", color: "hsl(var(--chart-1))" },
    mobile: { label: "Мобільні", color: "hsl(var(--chart-2))" },
};

export function LineChartMultiple() {
    const [range, setRange] = useState<"7" | "14" | "30" | "90">("90");
    const [data, setData] = useState<Row[]>([]);
    const [trend, setTrend] = useState(0);

    useEffect(() => {
        fetch(`/api/analytics?metric=monthlyOrders&range=${range}`)
            .then((r) => r.json())
            .then(({ data }: { data: any[] }) => {
                const rows: Row[] = data.map((item) => ({
                    month: item.month,
                    desktop: Number(item.desktop) || 0,
                    mobile: Number(item.mobile) || 0,
                }));
                setData(rows);
                if (rows.length >= 2) {
                    const last = rows.at(-1)!;
                    const prev = rows.at(-2)!;
                    const l = last.desktop + last.mobile;
                    const p = prev.desktop + prev.mobile;
                    setTrend(p > 0 ? ((l - p) / p) * 100 : 0);
                }
            })
            .catch(console.error);
    }, [range]);

    return (
        <Card>
            <div className="flex gap-2 mb-2 p-5">
                {(["7", "14", "30", "90"] as const).map((d) => (
                    <Button
                        key={d}
                        variant={range === d ? "default" : "outline"}
                        className={`${range === d ? "border border-[#1cca50]" : ""} cursor-pointer`}
                        onClick={() => setRange(d)}
                    >
                        {d} днів
                    </Button>
                ))}
            </div>
            <CardHeader>
                <CardTitle>
                    Динаміка замовлень по платформах (останні {range} днів)
                </CardTitle>
                <CardDescription>ПК vs мобільні замовлення</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart data={data} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v: string) => v}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="desktop"
                            type="monotone"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="mobile"
                            type="monotone"
                            stroke="var(--color-mobile)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 text-sm">
                <div className="font-medium flex items-center gap-2">
                    {trend >= 0 ? (
                        <>
                            Зросли на {trend.toFixed(1)}%{" "}
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </>
                    ) : (
                        <>
                            Зменшилися на {Math.abs(trend).toFixed(1)}%{" "}
                            <TrendingUp className="h-4 w-4 rotate-180 text-red-600" />
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
