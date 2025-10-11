"use client";

import React from "react";
import Link from "next/link";

interface DashboardNavProps {
    activeTab: string;
}

export function DashboardNav({ activeTab }: DashboardNavProps) {
    const tabs = [
        { id: "dashboard", label: "Дашборд", href: "/analytic" },
        { id: "orders", label: "Звіт замовлення", href: "/analytic/orders" },
        { id: "views", label: "Звіт переглядів", href: "/analytic/views" },
        { id: "products", label: "Топ товари", href: "/analytic/products" },
        { id: "forecasts", label: "Прогнози", href: "/analytic/forecasts" },
    ];

    return (
        <div className="flex gap-6 mb-8">
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    href={tab.href}
                    className={`text-sm font-medium transition-colors cursor-pointer ${
                        activeTab === tab.id
                            ? "text-[#1cca50] border-b-2 border-[#1cca50] pb-2"
                            : "text-gray-400 hover:text-white pb-2"
                    }`}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    );
}
