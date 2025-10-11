'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { motion, useTime, useTransform } from 'framer-motion'
import { useAppSelector } from '@/store/hooks'

type OrderItem = {
    product_id: number
    name: string
    image_url: string
    price: number
    discount: number
    quantity: number
}

type Order = {
    id: number
    order_date: string
    status: string
    payment_method: string
    city: string
    street: string
    house_number: string
    postal_code: string
    items: OrderItem[]
}

export default function OrdersPage() {
    const user = useAppSelector(s => s.auth.user)
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])

    const time = useTime()
    const rotate = useTransform(time, [0, 10000], [0, 360], { clamp: false })
    const rotatingBg = useTransform(
        rotate,
        r => `conic-gradient(from ${r}deg, #1cca50 0deg, #1cca50 60deg, transparent 60deg)`
    )

    useEffect(() => {
        if (!user) {
            router.push('/auth')
            toast.error('Please log in to view your orders.')
            return
        }
        fetch(`/api/orders?userId=${user.id}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then(data => setOrders(data.orders || []))
            .catch(err => toast.error(`Failed to load orders (${err.message})`))
    }, [user, router])

    if (!user) return null

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#1cca50]">My Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-400 text-center">You have no orders yet.</p>
            ) : (
                <ul className="space-y-6">
                    {orders.map(o => (
                        <li key={o.id} className="relative m-4 rounded-[20px]">
                            <div
                                className="absolute -inset-[2px] rounded-[20px] z-0"
                            />
                            <div className="relative bg-[#161924] border border-[#1cca50] rounded-[20px] p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-white">#{o.id}</span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(o.order_date).toLocaleString()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="text-gray-300 space-y-1">
                                        <p>
                                            <span className="font-semibold text-white">Status:</span> {' '}
                                            <span className="text-[#1cca50]">{o.status}</span>
                                        </p>
                                        <p>
                                            <span className="font-semibold text-white">Payment:</span> {' '}
                                            <span className="text-[#1cca50]">{o.payment_method}</span>
                                        </p>
                                        <p>
                                            <span className="font-semibold text-white">Address:</span> {' '}
                                            {o.city}, {o.street} {o.house_number}, {o.postal_code}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Items:</h3>
                                        <ul className="space-y-2">
                                            {o.items.map(item => (
                                                <li
                                                    key={item.product_id}
                                                    className="flex items-center gap-4 bg-[#0f1116] border border-[#1cca50] rounded-lg p-3"
                                                >
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="text-white font-medium">{item.name}</p>
                                                        <p className="text-gray-400 text-sm">
                                                            {item.quantity} × ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
