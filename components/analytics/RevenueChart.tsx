"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
    date: string;
    revenue: number;
}

export function RevenueChart() {
    const [data, setData] = useState<DataPoint[]>([]);
    const [range, setRange] = useState("all");

    useEffect(() => {
        fetch(`/api/analytics?metric=dailyViews&range=${range === "all" ? "365" : range}`)
            .then((res) => res.json())
            .then(({ data }) => {
                // Симулюємо дані доходу на основі переглядів
                const revenueData = data.map((item: any, index: number) => ({
                    date: item.date,
                    revenue: Math.round((item.web + item.mobile) * (50 + Math.random() * 100)) // 50-150 грн на перегляд
                }));
                setData(revenueData);
            })
            .catch(() => {
                // Fallback data if API fails
                setData([
                    { date: "01.01.2024", revenue: 1250 },
                    { date: "02.01.2024", revenue: 1800 },
                    { date: "03.01.2024", revenue: 950 },
                    { date: "04.01.2024", revenue: 2200 },
                    { date: "05.01.2024", revenue: 1650 },
                    { date: "06.01.2024", revenue: 2800 },
                    { date: "07.01.2024", revenue: 1950 },
                ]);
            });
    }, [range]);

    const getTitle = () => {
        if (range === "all") return "Дохід за день (за весь час)";
        return `Дохід за день (останні ${range} днів)`;
    };

    return (
        <div className="bg-[#161924] border border-[#1cca50] rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{getTitle()}</h3>
                <p className="text-gray-400 text-sm">Денний дохід від продажів</p>
            </div>
            
            <div className="flex gap-2 mb-6">
                {(["7", "14", "30", "90", "all"] as const).map((d) => (
                    <button
                        key={d}
                        onClick={() => setRange(d)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 cursor-pointer ${
                            range === d
                                ? "bg-[#1cca50] text-black shadow-lg shadow-[#1cca50]/25"
                                : "bg-gray-700 text-gray-300 hover:bg-[#1cca50]/20 hover:text-white hover:shadow-md hover:shadow-[#1cca50]/15"
                        }`}
                    >
                        {d === "all" ? "За весь час" : `${d} днів`}
                    </button>
                ))}
            </div>
            
            <div className="h-80">
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                            dataKey="date" 
                            stroke="#9CA3AF"
                            fontSize={12}
                            tick={{ fill: "#9CA3AF" }}
                        />
                        <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                            tick={{ fill: "#9CA3AF" }}
                            domain={[0, 'dataMax + 500']}
                        />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "#1F2937",
                                border: "1px solid #1cca50",
                                borderRadius: "8px",
                                color: "white",
                            }}
                            labelStyle={{ color: "white" }}
                            itemStyle={{ color: "white" }}
                            formatter={(value: number) => [`${value} ₴`, 'Дохід']}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#1cca50" 
                            strokeWidth={3}
                            dot={{ fill: "#1cca50", strokeWidth: 2, r: 5 }}
                            activeDot={{ r: 8, stroke: "#1cca50", strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
