// components/charts/PieChartDonut.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Pie, PieChart, Label, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface PlatformRow {
    platform: string;
    count: number;
}
interface OrderRow {
    desktop: number;
    mobile: number;
}

const COLORS = ['#1cca50', '#22c55e', '#16a34a'];

export function PieChartDonut() {
    const [range, setRange] = useState<"7" | "14" | "30" | "90">("90");
    const [data, setData] = useState<PlatformRow[]>([]);
    const [trend, setTrend] = useState(0);

    useEffect(() => {
        fetch(`/api/analytics?metric=platformViews&range=${range}`)
            .then((r) => r.json())
            .then(({ data }: { data: any[] }) => {
                if (data && data.length > 0) {
                    setData(
                        data.map((item) => ({
                            platform: item.platform,
                            count: Number(item.count) || 0,
                        }))
                    );
                } else {
                    // Fallback дані
                    setData([
                        { platform: "web", count: 45 },
                        { platform: "ios", count: 30 },
                        { platform: "android", count: 25 },
                    ]);
                }
            })
            .catch(() => {
                // Fallback дані
                setData([
                    { platform: "web", count: 45 },
                    { platform: "ios", count: 30 },
                    { platform: "android", count: 25 },
                ]);
            });

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
            .catch(() => {
                setTrend(15.5); // Fallback тренд
            });
    }, [range]);

    const total = useMemo(() => data.reduce((sum, x) => sum + x.count, 0), [data]);

    return (
        <div className="bg-[#161924] border border-[#1cca50] rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Розподіл переглядів за платформами</h3>
                <p className="text-gray-400 text-sm">останні {range} днів</p>
            </div>
            
            <div className="flex gap-2 mb-6">
                {(["7", "14", "30", "90"] as const).map((d) => (
                    <button
                        key={d}
                        onClick={() => setRange(d)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 cursor-pointer ${
                            range === d
                                ? "bg-[#1cca50] text-black shadow-lg shadow-[#1cca50]/25"
                                : "bg-gray-700 text-gray-300 hover:bg-[#1cca50]/20 hover:text-white hover:shadow-md hover:shadow-[#1cca50]/15"
                        }`}
                    >
                        {d} днів
                    </button>
                ))}
            </div>
            
            <div className="h-80">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="platform"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            fillOpacity={0.8}
                            strokeWidth={2}
                            stroke="#1F2937"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                                                className="fill-white text-sm font-medium"
                                            >
                                                {total.toLocaleString("uk-UA")}
                                            </text>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </Pie>
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "1px solid #1cca50",
                                borderRadius: "8px",
                                color: "white",
                            }}
                            labelStyle={{ color: "white" }}
                            itemStyle={{ color: "white" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex flex-col items-center text-sm">
                <div className="font-medium flex items-center gap-2 text-white">
                    {trend >= 0 ? (
                        <>
                            Зросли на {trend.toFixed(1)}%{" "}
                            <TrendingUp className="h-4 w-4 text-green-400" />
                        </>
                    ) : (
                        <>
                            Зменшилися на {Math.abs(trend).toFixed(1)}%{" "}
                            <TrendingUp className="h-4 w-4 rotate-180 text-red-400" />
                        </>
                    )}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                    Разом: {total.toLocaleString("uk-UA")}
                </div>
            </div>
        </div>
    );
}
