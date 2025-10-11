"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
    date: string;
    views: number;
}

export function ViewsChart() {
    const [data, setData] = useState<DataPoint[]>([]);
    const [range, setRange] = useState("all");

    useEffect(() => {
        fetch(`/api/analytics?metric=dailyViews&range=${range === "all" ? "365" : range}`)
            .then((res) => res.json())
            .then(({ data }) => {
                const formattedData = data.map((item: any) => ({
                    date: item.date,
                    views: Math.round((item.web + item.mobile) / 10), // Ділимо на 10 для кращого відображення
                }));
                setData(formattedData);
            })
            .catch(() => {
                // Fallback data if API fails
                setData([
                    { date: "01.01.2024", views: 8 },
                    { date: "02.01.2024", views: 12 },
                    { date: "03.01.2024", views: 6 },
                    { date: "04.01.2024", views: 15 },
                    { date: "05.01.2024", views: 10 },
                    { date: "06.01.2024", views: 18 },
                    { date: "07.01.2024", views: 14 },
                ]);
            });
    }, [range]);

    const getTitle = () => {
        if (range === "all") return "Перегляди за день (за весь час)";
        return `Перегляди за день (останні ${range} днів)`;
    };

    return (
        <div className="bg-[#161924] border border-[#1cca50] rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{getTitle()}</h3>
                <p className="text-gray-400 text-sm">Денна кількість переглядів по платформах</p>
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
                    <AreaChart data={data}>
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
                            domain={[0, 'dataMax + 100']}
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
                            formatter={(value: number) => [`${value * 10} переглядів`, 'Перегляди (×10)']}
                        />
                        <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#1cca50"
                            fill="#1cca50"
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
