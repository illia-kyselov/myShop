"use client";

import React, { useState, useEffect } from "react";
import { DashboardNav } from "@/components/analytics/DashboardNav";
import { ExcelDownload } from "@/components/analytics/ExcelDownload";

interface ViewData {
    date: string;
    web: number;
    mobile: number;
    total: number;
}

const ViewsReportPage: React.FC = () => {
    const [viewData, setViewData] = useState<ViewData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/analytics?metric=dailyViews&range=30")
            .then((res) => res.json())
            .then(({ data }) => {
                const formattedData = data.map((item: any) => ({
                    date: item.date,
                    web: item.web,
                    mobile: item.mobile,
                    total: item.web + item.mobile,
                }));
                setViewData(formattedData);
                setLoading(false);
            })
            .catch(() => {
                setViewData([]);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString.split('.').reverse().join('-')).toLocaleDateString('uk-UA');
    };

    return (
        <div className="flex flex-col gap-8 p-8">
            <DashboardNav activeTab="views" />
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Звіт переглядів</h1>
                    <p className="text-gray-400">Денна статистика переглядів товарів</p>
                </div>
                <ExcelDownload 
                    data={viewData} 
                    filename="views_report" 
                    title="Скачати Excel"
                />
            </div>

            <div className="bg-[#161924] border border-[#1cca50] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#1cca50] text-black">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Дата</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Веб</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Мобільні</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Всього</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                        Завантаження...
                                    </td>
                                </tr>
                            ) : viewData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                        Немає даних
                                    </td>
                                </tr>
                            ) : (
                                viewData.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                                        <td className="px-6 py-4 text-white">{formatDate(item.date)}</td>
                                        <td className="px-6 py-4 text-blue-400">{item.web}</td>
                                        <td className="px-6 py-4 text-green-400">{item.mobile}</td>
                                        <td className="px-6 py-4 text-white font-semibold">{item.total}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewsReportPage;
