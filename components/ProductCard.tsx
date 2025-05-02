'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { createClient, Photos } from 'pexels'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addToCart } from '@/store/cartSlice'
import type { Product } from '@/types/types'

interface Props {
    product: Product
}

const pexelsClient = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY || '')

export default function ProductCard({ product }: Props) {
    const dispatch = useAppDispatch()
    const user = useAppSelector(s => s.auth.user)
    const [img, setImg] = useState(product.image_url || '/product.webp')
    const [added, setAdded] = useState(false)

    const fetchPhoto = async () => {
        try {
            const page = Math.floor(Math.random() * 100) + 1
            const res = (await pexelsClient.photos.curated({
                per_page: 1,
                page,
            })) as Photos
            if (res.photos.length) setImg(res.photos[0].src.large2x)
        } catch {
            setImg('/product.webp')
        }
    }

    const handleAdd = () => {
        dispatch(
            addToCart({
                ...product,
                price: Number(product.price),
            })
        )
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)

        if (user) {
            const PLATFORMS = ['web', 'android', 'ios']
            const platform =
                PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)]
            fetch('/api/product-views', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    userId: user.id,
                    platform,
                }),
            })
        }
    }

    const priceNum = Number(product.price)
    const net = priceNum * (1 - product.discount / 100)

    return (
        <div className="bg-[#161924] border border-[#1cca50] rounded-lg overflow-hidden flex flex-col">
            <Image
                src={img}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                onError={fetchPhoto}
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">
                        {product.name}
                    </h2>
                    <p className="text-sm text-gray-300">
                        {product.description}
                    </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    {product.discount > 0 ? (
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-green-400">
                                ${net.toFixed(2)}
                            </span>
                            <span className="text-sm line-through text-gray-500">
                                ${priceNum.toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-lg font-bold text-green-400">
                            ${priceNum.toFixed(2)}
                        </span>
                    )}
                    <motion.button
                        onClick={handleAdd}
                        whileTap={{ scale: 0.9 }}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
                    >
                        {added ? '✓ Added' : 'Add to Cart'}
                    </motion.button>
                </div>
            </div>
        </div>
    )
}
