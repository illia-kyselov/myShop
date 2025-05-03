"use client";

import React, { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
    web: number;
    mobile: number;
}

const chartConfig: ChartConfig = {
    web: { label: "Веб", color: "hsl(var(--chart-1))" },
    mobile: { label: "Мобільні", color: "hsl(var(--chart-2))" },
};

export function BarChartMultiple() {
    const [range, setRange] = useState<"7" | "14" | "30" | "90">("90");
    const [data, setData] = useState<Row[]>([]);
    const [trend, setTrend] = useState(0);

    useEffect(() => {
        fetch(`/api/analytics?metric=monthlyViews&range=${range}`)
            .then((r) => r.json())
            .then(({ data }: { data: Row[] }) => {
                setData(data);
                if (data.length >= 2) {
                    const last = data.at(-1)!;
                    const prev = data.at(-2)!;
                    const l = last.web + last.mobile;
                    const p = prev.web + prev.mobile;
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
                    Помісячні перегляди (останні {range} днів)
                </CardTitle>
                <CardDescription>
                    Порівняння веб vs мобільних переглядів
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar dataKey="web" fill="var(--color-web)" radius={4} />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="text-sm">
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
