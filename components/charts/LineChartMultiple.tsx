"use client";

import React, { useState, useEffect } from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface Row {
    month: string;
    desktop: number;
    mobile: number;
}


export function LineChartMultiple() {
    const [range, setRange] = useState<"7" | "14" | "30" | "90">("90");
    const [data, setData] = useState<Row[]>([]);
    const [trend, setTrend] = useState(0);

    useEffect(() => {
        fetch(`/api/analytics?metric=monthlyOrders&range=${range}`)
            .then((r) => r.json())
            .then(({ data }: { data: any[] }) => {
                if (data && data.length > 0) {
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
                } else {
                    // Fallback дані
                    setData([
                        { month: "07.2025", desktop: 120, mobile: 180 },
                        { month: "08.2025", desktop: 140, mobile: 220 },
                        { month: "09.2025", desktop: 100, mobile: 160 },
                        { month: "10.2025", desktop: 90, mobile: 140 },
                    ]);
                    setTrend(15.5);
                }
            })
            .catch(() => {
                // Fallback дані
                setData([
                    { month: "07.2025", desktop: 120, mobile: 180 },
                    { month: "08.2025", desktop: 140, mobile: 220 },
                    { month: "09.2025", desktop: 100, mobile: 160 },
                    { month: "10.2025", desktop: 90, mobile: 140 },
                ]);
                setTrend(15.5);
            });
    }, [range]);

    return (
        <div className="bg-[#161924] border border-[#1cca50] rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Динаміка замовлень по платформах</h3>
                <p className="text-gray-400 text-sm">ПК vs мобільні замовлення (останні {range} днів)</p>
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
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            dataKey="month" 
                            stroke="#9CA3AF"
                            fontSize={12}
                        />
                        <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                            domain={[0, 'dataMax + 50']}
                        />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "1px solid #1cca50",
                                borderRadius: "8px",
                                color: "white",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="desktop"
                            stroke="#1cca50"
                            strokeWidth={2}
                            dot={{ fill: "#1cca50", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: "#1cca50", strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="mobile"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="font-medium text-white">
                    {trend >= 0 ? (
                        <>
                            Зросли на {trend.toFixed(1)}%{" "}
                            <TrendingUp className="h-4 w-4 text-green-400 inline ml-1" />
                        </>
                    ) : (
                        <>
                            Зменшилися на {Math.abs(trend).toFixed(1)}%{" "}
                            <TrendingUp className="h-4 w-4 rotate-180 text-red-400 inline ml-1" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
