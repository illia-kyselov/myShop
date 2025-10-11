"use client";

import React, { useState, useEffect } from "react";
import { DashboardNav } from "@/components/analytics/DashboardNav";
import { ExcelDownload } from "@/components/analytics/ExcelDownload";

interface Order {
    id: number;
    user_id: number;
    order_date: string;
    status: string;
    payment_method: string;
    total_amount: number;
    user_email: string;
}

const OrdersReportPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/orders")
            .then((res) => res.json())
            .then(({ orders }) => {
                setOrders(orders || []);
                setLoading(false);
            })
            .catch(() => {
                setOrders([]);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('uk-UA');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-500';
            case 'pending': return 'text-yellow-500';
            case 'processing': return 'text-blue-500';
            case 'cancelled': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="flex flex-col gap-8 p-8">
            <DashboardNav activeTab="orders" />
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Звіт замовлень</h1>
                    <p className="text-gray-400">Всі замовлення в системі</p>
                </div>
                <ExcelDownload 
                    data={orders} 
                    filename="orders_report" 
                    title="Скачати Excel"
                />
            </div>

            <div className="bg-[#161924] border border-[#1cca50] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#1cca50] text-black">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Користувач</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Дата</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Статус</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Оплата</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">Сума</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Завантаження...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        Немає замовлень
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-800">
                                        <td className="px-6 py-4 text-white">#{order.id}</td>
                                        <td className="px-6 py-4 text-white">{order.user_email}</td>
                                        <td className="px-6 py-4 text-gray-300">{formatDate(order.order_date)}</td>
                                        <td className={`px-6 py-4 ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{order.payment_method}</td>
                                        <td className="px-6 py-4 text-white font-semibold">
                                            {formatCurrency(order.total_amount)}
                                        </td>
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

export default OrdersReportPage;
