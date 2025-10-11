'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { clearCart, removeFromCart, CartItem } from '@/store/cartSlice'

export default function CartPage() {
    const items = useAppSelector(state => state.cart.items) as CartItem[]
    const user = useAppSelector(state => state.auth.user)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const [city, setCity] = useState('')
    const [street, setStreet] = useState('')
    const [houseNumber, setHouseNumber] = useState('')
    const [postalCode, setPostalCode] = useState('')

    const total = items
        .reduce(
            (sum, { product, quantity }) =>
                sum + product.price * (1 - product.discount / 100) * quantity,
            0
        )
        .toFixed(2)

    const handleOrder = async () => {
        if (!user) {
            toast.error('Please log in to place an order.')
            return
        }
        if (!city || !street || !houseNumber || !postalCode) {
            toast.error('Please fill in all address fields.')
            return
        }
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items,
                userId: user.id,
                address: { city, street, houseNumber, postalCode },
            }),
        })
        const data = await res.json()
        if (res.ok) {
            dispatch(clearCart())
            toast.success(`Order #${data.orderId} placed successfully!`)
            router.push('/')
        } else {
            toast.error('Failed to place order.')
        }
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl">Your cart is empty</h1>
                <Link href="/" className="text-green-400 hover:underline">
                    Back to products
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Cart</h1>
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City"
                    className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
                />
                <input
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="Street"
                    className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
                />
                <input
                    value={houseNumber}
                    onChange={e => setHouseNumber(e.target.value)}
                    placeholder="House number"
                    className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
                />
                <input
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    placeholder="Postal code"
                    className="p-2 border border-gray-600 rounded bg-gray-800 text-white"
                />
            </div>
            <div className="space-y-4">
                {items.map(({ product, quantity }) => {
                    const unit = (product.price * (1 - product.discount / 100)).toFixed(2)
                    const line = (
                        product.price *
                        (1 - product.discount / 100) *
                        quantity
                    ).toFixed(2)
                    return (
                        <div
                            key={product.id}
                            className="relative flex items-center gap-4 bg-gray-800 p-4 rounded"
                        >
                            <button
                                onClick={() => dispatch(removeFromCart(product.id))}
                                className="absolute top-2 right-2 text-white hover:text-red-500 cursor-pointer"
                            >
                                ✕
                            </button>
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h2 className="text-xl text-white">{product.name}</h2>
                                <p className="text-gray-400">
                                    {quantity} × ${unit}
                                </p>
                            </div>
                            <p className="font-bold text-white">${line}</p>
                        </div>
                    )
                })}
            </div>
            <div className="mt-6 flex justify-between items-center">
                <span className="text-2xl font-bold">Total: ${total}</span>
                <button
                    onClick={handleOrder}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded cursor-pointer"
                >
                    Place Order
                </button>
            </div>
        </div>
    )
}
