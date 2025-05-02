import { NextResponse } from 'next/server'
import pool from '@/lib/db/postgres'

export async function POST(request: Request) {
    try {
        const { productId, userId, platform } = await request.json()

        await pool.query(
            `INSERT INTO public.product_views
         (product_id, user_id, viewed_at, platform)
       VALUES ($1, $2, NOW(), $3)`,
            [productId, userId, platform]
        )

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('Failed to record product view:', error)
        return NextResponse.json(
            { error: 'Could not record product view.' },
            { status: 500 }
        )
    }
}
