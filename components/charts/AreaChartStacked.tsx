"use client";

import React, { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface Row {
    date: string;
    web: number;
    mobile: number;
}

export function AreaChartStacked() {
    const [range, setRange] = useState<"7" | "14" | "30" | "90">("30");
    const [data, setData] = useState<Row[]>([]);

    useEffect(() => {
        fetch(`/api/analytics?metric=dailyViews&range=${range}`)
            .then((r) => r.json())
            .then(({ data }: { data: Row[] }) => {
                setData(data);
            })
            .catch(() => {
                // Fallback data
                setData([
                    { date: "01.09", web: 45, mobile: 30 },
                    { date: "02.09", web: 52, mobile: 38 },
                    { date: "03.09", web: 38, mobile: 25 },
                    { date: "04.09", web: 60, mobile: 42 },
                    { date: "05.09", web: 48, mobile: 35 },
                ]);
            });
    }, [range]);

    return (
        <div className="bg-[#161924] border border-[#1cca50] rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Перегляди за день (останні {range} днів)</h3>
                <p className="text-gray-400 text-sm">Денна кількість переглядів по платформах</p>
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
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            dataKey="date" 
                            stroke="#9CA3AF"
                            fontSize={12}
                        />
                        <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                            domain={[0, 'dataMax + 20']}
                        />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "1px solid #1cca50",
                                borderRadius: "8px",
                                color: "white",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="web"
                            stackId="1"
                            stroke="#1cca50"
                            fill="#1cca50"
                            fillOpacity={0.3}
                        />
                        <Area
                            type="monotone"
                            dataKey="mobile"
                            stackId="1"
                            stroke="#22c55e"
                            fill="#22c55e"
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
