"use client";

import React, { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

interface Row {
    date: string;
    web: number;
    mobile: number;
}

const chartConfig: ChartConfig = {
    web: { label: "Веб", color: "hsl(var(--chart-1))" },
    mobile: { label: "Мобільні", color: "hsl(var(--chart-2))" },
};

export function AreaChartStacked() {
    const [range, setRange] = useState<"7" | "14" | "30" | "90">("30");
    const [data, setData] = useState<Row[]>([]);
    const [trend, setTrend] = useState(0);

    useEffect(() => {
        fetch(`/api/analytics?metric=dailyViews&range=${range}`)
            .then((r) => r.json())
            .then(({ data }: { data: Row[] }) => {
                setData(data);
                if (data.length >= 2) {
                    const last = data.at(-1)!;
                    const prev = data.at(-2)!;
                    const dLast = last.web + last.mobile;
                    const dPrev = prev.web + prev.mobile;
                    setTrend(dPrev > 0 ? ((dLast - dPrev) / dPrev) * 100 : 0);
                }
            })
            .catch(console.error);
    }, [range]);

    return (
        <Card className="p-2">
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
                <CardTitle>Перегляди за день (останні {range} днів)</CardTitle>
                <CardDescription>
                    Денна кількість переглядів по платформах
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} />
                        <YAxis axisLine={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Area
                            type="monotone"
                            dataKey="web"
                            stroke="hsl(var(--chart-1))"
                            fill="hsl(var(--chart-1))/20"
                            stackId="a"
                        />
                        <Area
                            type="monotone"
                            dataKey="mobile"
                            stroke="hsl(var(--chart-2))"
                            fill="hsl(var(--chart-2))/20"
                            stackId="a"
                        />
                    </AreaChart>
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
