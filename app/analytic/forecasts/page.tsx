"use client";

import React, { useState, useEffect } from "react";
import { DashboardNav } from "@/components/analytics/DashboardNav";
import { ExcelDownload } from "@/components/analytics/ExcelDownload";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface Forecast {
    metric: string;
    current: number;
    forecast: number;
    change: number;
    period: string;
}

const ForecastsPage: React.FC = () => {
    const [forecasts, setForecasts] = useState<Forecast[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Отримуємо реальні прогнози з API
        fetch("/api/analytics?metric=forecasts")
            .then(res => res.json())
            .then(({ data }) => {
                if (data && data.length > 0) {
                    setForecasts(data);
                } else {
                    // Fallback дані якщо немає реальних
                    setForecasts([
                        {
                            metric: "Продажі наступного місяця",
                            current: 0,
                            forecast: 0,
                            change: 0,
                            period: "наступний місяць"
                        },
                        {
                            metric: "Перегляди товарів",
                            current: 0,
                            forecast: 0,
                            change: 0,
                            period: "наступні 30 днів"
                        },
                        {
                            metric: "Нові користувачі",
                            current: 0,
                            forecast: 0,
                            change: 0,
                            period: "наступний тиждень"
                        },
                        {
                            metric: "Середній чек",
                            current: 0,
                            forecast: 0,
                            change: 0,
                            period: "наступний місяць"
                        },
                        {
                            metric: "Конверсія",
                            current: 0,
                            forecast: 0,
                            change: 0,
                            period: "наступні 2 тижні"
                        }
                    ]);
                }
                setLoading(false);
            })
            .catch(() => {
                setForecasts([]);
                setLoading(false);
            });
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH',
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('uk-UA').format(num);
    };

    const getChangeIcon = (change: number) => {
        if (change > 0) return <TrendingUp className="w-5 h-5 text-green-500" />;
        if (change < 0) return <TrendingDown className="w-5 h-5 text-red-500" />;
        return <BarChart3 className="w-5 h-5 text-gray-500" />;
    };

    const getChangeColor = (change: number) => {
        if (change > 0) return 'text-green-500';
        if (change < 0) return 'text-red-500';
        return 'text-gray-500';
    };

    return (
        <div className="flex flex-col gap-8 p-8">
            <DashboardNav activeTab="forecasts" />
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Прогнози</h1>
                    <p className="text-gray-400">Прогнозовані показники на основі поточних трендів</p>
                </div>
                <ExcelDownload 
                    data={forecasts} 
                    filename="forecasts_report" 
                    title="Скачати Excel"
                />
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="bg-[#161924] border border-[#1cca50] rounded-lg p-6 animate-pulse">
                            <div className="h-32"></div>
                        </div>
                    ))
                ) : (
                    forecasts.map((forecast, index) => (
                        <div key={index} className="bg-[#161924] border border-[#1cca50] rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">{forecast.metric}</h3>
                                {getChangeIcon(forecast.change)}
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-400 text-sm">Поточне значення</p>
                                    <p className="text-white font-semibold">
                                        {forecast.metric.includes('Продажі') || forecast.metric.includes('чек') 
                                            ? formatCurrency(forecast.current)
                                            : forecast.metric.includes('Конверсія')
                                            ? `${forecast.current}%`
                                            : formatNumber(forecast.current)
                                        }
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-400 text-sm">Прогноз на {forecast.period}</p>
                                    <p className="text-white font-semibold">
                                        {forecast.metric.includes('Продажі') || forecast.metric.includes('чек') 
                                            ? formatCurrency(forecast.forecast)
                                            : forecast.metric.includes('Конверсія')
                                            ? `${forecast.forecast}%`
                                            : formatNumber(forecast.forecast)
                                        }
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${getChangeColor(forecast.change)}`}>
                                        {forecast.change > 0 ? '+' : ''}{forecast.change.toFixed(1)}%
                                    </span>
                                    <span className="text-gray-400 text-sm">зміна</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ForecastsPage;
