// components/charts/PieChartDonut.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Pie, PieChart, Label, Cell } from "recharts";
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

interface PlatformRow {
    platform: string;
    count: number;
}
interface OrderRow {
    desktop: number;
    mobile: number;
}

const chartConfig: ChartConfig = {
    web: { label: "Web", color: "hsl(var(--chart-1))" },
    ios: { label: "iOS", color: "hsl(var(--chart-2))" },
    android: { label: "Android", color: "hsl(var(--chart-3))" },
};

export function PieChartDonut() {
    const [range, setRange] = useState<"7" | "14" | "30" | "90">("90");
    const [data, setData] = useState<PlatformRow[]>([]);
    const [trend, setTrend] = useState(0);

    useEffect(() => {
        fetch(`/api/analytics?metric=platformViews&range=${range}`)
            .then((r) => r.json())
            .then(({ data }: { data: any[] }) => {
                setData(
                    data.map((item) => ({
                        platform: item.platform,
                        count: Number(item.count) || 0,
                    }))
                );
            })
            .catch(console.error);

        fetch(`/api/analytics?metric=monthlyOrders&range=${range}`)
            .then((r) => r.json())
            .then(({ data }: { data: any[] }) => {
                const rows: OrderRow[] = data.map((item) => ({
                    desktop: Number(item.desktop) || 0,
                    mobile: Number(item.mobile) || 0,
                }));
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

    const total = useMemo(() => data.reduce((sum, x) => sum + x.count, 0), [data]);

    return (
        <Card className="flex flex-col">
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
            <CardHeader className="items-center pb-0">
                <CardTitle>Розподіл переглядів за платформами</CardTitle>
                <CardDescription>останні {range} днів</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[600px]"
                >
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="platform"
                            innerRadius={80}
                            outerRadius={200}
                            fillOpacity={1}
                            strokeWidth={5}
                        >
                            {data.map((item) => (
                                <Cell key={item.platform} fill={`var(--color-${item.platform})`} />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {total.toLocaleString("uk-UA")}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Перегляди
                                                </tspan>
                                            </text>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-center text-sm">
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
                <div className="text-xs text-muted-foreground">
                    Разом: {total.toLocaleString("uk-UA")}
                </div>
            </CardFooter>
        </Card>
    );
}
