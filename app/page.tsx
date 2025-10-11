import React from 'react'
import ProductCard from '@/components/ProductCard'
import { getProducts, getProductsCount } from '@/lib/db/postgres'
import { PaginationWithLinks } from '@/components/PaginationWithLinks'
import type { Product } from '@/types/types'

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const { page: ps = '1' } = await searchParams
    const page = parseInt(ps, 10)
    const limit = 50
    const offset = (page - 1) * limit
    const products = (await getProducts(limit, offset)) as Product[]
    const total = await getProductsCount()

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
            <div className="mt-8">
                <PaginationWithLinks currentPage={page} totalCount={total} pageSize={limit} />
            </div>
        </div>
    )
}
