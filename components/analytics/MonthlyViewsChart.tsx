"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
    month: string;
    web: number;
    mobile: number;
}

export function MonthlyViewsChart() {
    const [data, setData] = useState<DataPoint[]>([]);
    const [range, setRange] = useState("all");

    useEffect(() => {
        fetch(`/api/analytics?metric=monthlyViews&range=${range === "all" ? "365" : range}`)
            .then((res) => res.json())
            .then(({ data }) => {
                const formattedData = data.map((item: any) => ({
                    month: item.month,
                    web: Math.round(item.web / 10), // Ділимо на 10
                    mobile: Math.round(item.mobile / 10), // Ділимо на 10
                }));
                setData(formattedData);
            })
            .catch(() => {
                // Fallback data if API fails
                setData([
                    { month: "01.2024", web: 12, mobile: 8 },
                    { month: "02.2024", web: 15, mobile: 9 },
                    { month: "03.2024", web: 18, mobile: 11 },
                    { month: "04.2024", web: 20, mobile: 13 },
                    { month: "05.2024", web: 22, mobile: 14 },
                ]);
            });
    }, [range]);

    const getTitle = () => {
        if (range === "all") return "Помісячні перегляди (за весь час)";
        return `Помісячні перегляди (останні ${range} днів)`;
    };

    return (
        <div className="bg-[#161924] border border-[#1cca50] rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{getTitle()}</h3>
                <p className="text-gray-400 text-sm">Порівняння веб vs мобільних переглядів</p>
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
                    <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                    dataKey="month" 
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
                            formatter={(value: number, name: string) => [
                                `${value * 10} переглядів`, 
                                name === 'web' ? 'Web (×10)' : 'Mobile (×10)'
                            ]}
                        />
                <Bar 
                    dataKey="web" 
                    fill="#1cca50" 
                    radius={[2, 2, 0, 0]}
                />
                <Bar 
                    dataKey="mobile" 
                    fill="#22c55e" 
                    radius={[2, 2, 0, 0]}
                />
            </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
