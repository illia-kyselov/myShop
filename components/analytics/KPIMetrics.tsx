"use client";

import React, { useState, useEffect } from "react";
import { KPICard } from "./KPICard";
import { DollarSign, ShoppingCart, Target, Wallet, Users } from "lucide-react";

interface KPIData {
    totalRevenue: number;
    ordersPerDay: number;
    conversionRate: number;
    avgCheck: number;
    totalUsers: number;
}

export function KPIMetrics() {
    const [kpiData, setKpiData] = useState<KPIData | null>(null);

    useEffect(() => {
        fetch("/api/analytics?metric=kpi")
            .then((res) => res.json())
            .then(({ data }) => {
                setKpiData(data);
            })
            .catch(() => {
                // Fallback data if API fails
                setKpiData({
                    totalRevenue: 768006714,
                    ordersPerDay: 10227,
                    conversionRate: 4734,
                    avgCheck: 75096,
                    totalUsers: 1010,
                });
            });
    }, []);

    if (!kpiData) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-[#161924] border border-[#1cca50] rounded-lg p-6 animate-pulse">
                        <div className="h-20"></div>
                    </div>
                ))}
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('uk-UA').format(num);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <KPICard
                title="Загальний дохід"
                value={formatCurrency(kpiData.totalRevenue)}
                change={3282.5}
                icon={<DollarSign className="w-5 h-5 text-black" />}
            />
            
            <KPICard
                title="Заказів/день"
                value={formatNumber(kpiData.ordersPerDay)}
                change={3402.4}
                icon={<ShoppingCart className="w-5 h-5 text-black" />}
            />
            
            <KPICard
                title="Конверсія"
                value={`${formatNumber(kpiData.conversionRate)}%`}
                change={0.0}
                icon={<Target className="w-5 h-5 text-black" />}
            />
            
            <KPICard
                title="Середній чек"
                value={formatCurrency(kpiData.avgCheck)}
                change={-3.4}
                icon={<Wallet className="w-5 h-5 text-black" />}
            />
            
            <KPICard
                title="Користувачів"
                value={formatNumber(kpiData.totalUsers)}
                change={37.4}
                icon={<Users className="w-5 h-5 text-black" />}
            />
        </div>
    );
}
