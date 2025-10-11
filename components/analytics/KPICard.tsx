"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
}

export function KPICard({ title, value, change, icon }: KPICardProps) {
    const isPositive = change > 0;
    const isNegative = change < 0;
    const isNeutral = change === 0;

    return (
        <div className="bg-[#161924] border border-[#1cca50] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="text-gray-400 text-sm font-medium">{title}</div>
                <div className="w-10 h-10 bg-[#1cca50] rounded-full flex items-center justify-center">
                    {icon}
                </div>
            </div>
            
            <div className="mb-2">
                <div className="text-2xl font-bold text-white">{value}</div>
            </div>
            
            <div className="flex items-center gap-2">
                {isPositive && <TrendingUp className="w-4 h-4 text-green-500" />}
                {isNegative && <TrendingDown className="w-4 h-4 text-red-500" />}
                {isNeutral && <Minus className="w-4 h-4 text-gray-500" />}
                
                <span 
                    className={`text-sm font-medium ${
                        isPositive ? 'text-green-500' : 
                        isNegative ? 'text-red-500' : 
                        'text-gray-500'
                    }`}
                >
                    {isPositive ? '↑' : isNegative ? '↓' : '~'} {Math.abs(change).toFixed(1)}%
                </span>
            </div>
        </div>
    );
}
