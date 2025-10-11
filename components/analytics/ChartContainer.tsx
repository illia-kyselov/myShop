"use client";

import React, { useState, ReactNode } from "react";

interface ChartContainerProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    onRangeChange?: (range: string) => void;
}

export function ChartContainer({ title, subtitle, children, onRangeChange }: ChartContainerProps) {
    const [selectedRange, setSelectedRange] = useState("all");

    const ranges = [
        { id: "7", label: "7 днів" },
        { id: "14", label: "14 днів" },
        { id: "30", label: "30 днів" },
        { id: "90", label: "90 днів" },
        { id: "all", label: "За весь час" },
    ];

    const handleRangeChange = (range: string) => {
        setSelectedRange(range);
        onRangeChange?.(range);
    };

    return (
        <div className="bg-[#161924] border border-[#1cca50] rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{subtitle}</p>
            </div>
            
            <div className="flex gap-2 mb-6">
                {ranges.map((range) => (
                    <button
                        key={range.id}
                        onClick={() => handleRangeChange(range.id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 cursor-pointer ${
                            selectedRange === range.id
                                ? "bg-[#1cca50] text-black shadow-lg shadow-[#1cca50]/25"
                                : "bg-gray-700 text-gray-300 hover:bg-[#1cca50]/20 hover:text-white hover:shadow-md hover:shadow-[#1cca50]/15"
                        }`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>
            
            <div className="h-64">
                {children}
            </div>
        </div>
    );
}
