import { NextResponse } from 'next/server'
import pool from '@/lib/db/postgres'

const PAYMENT_METHODS = ['apple_pay', 'paypal']

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userIdParam = searchParams.get('userId')
        
        let query: string
        let params: any[]
        
        if (userIdParam) {
            // Запит для конкретного користувача
            const userId = parseInt(userIdParam, 10)
            query = `
                SELECT o.id, o.order_date, o.status, o.payment_method, o.city, o.street, o.house_number, o.postal_code,
                       u.login as user_email
                FROM public.orders o
                JOIN public.users u ON o.user_id = u.id
                WHERE o.user_id = $1
                ORDER BY o.order_date DESC
            `
            params = [userId]
        } else {
            // Запит для всіх замовлень (адмін)
            query = `
                SELECT o.id, o.order_date, o.status, o.payment_method, o.city, o.street, o.house_number, o.postal_code,
                       u.login as user_email
                FROM public.orders o
                JOIN public.users u ON o.user_id = u.id
                ORDER BY o.order_date DESC
            `
            params = []
        }

        const ordersRes = await pool.query(query, params)
        const orders = ordersRes.rows
        if (orders.length === 0) {
            return NextResponse.json({ orders: [] })
        }

        const orderIds = orders.map(o => o.id)
        const itemsRes = await pool.query(
            `SELECT oi.order_id, oi.quantity, p.id AS product_id, p.name, p.image_url, p.price, p.discount
         FROM public.order_items oi
         JOIN public.products p ON oi.product_id = p.id
        WHERE oi.order_id = ANY($1)`,
            [orderIds]
        )
        const itemsRows = itemsRes.rows

        const itemsByOrder: Record<number, typeof itemsRows> = {}
        for (const r of itemsRows) {
            itemsByOrder[r.order_id] = itemsByOrder[r.order_id] || []
            itemsByOrder[r.order_id].push(r)
        }

        const ordersWithItems = orders.map(o => {
            const items = itemsByOrder[o.id] || []
            const total_amount = items.reduce((sum, item) => {
                return sum + (item.quantity * item.price * (1 - item.discount / 100))
            }, 0)
            
            return {
                ...o,
                items,
                total_amount
            }
        })

        return NextResponse.json({ orders: ordersWithItems })
    } catch (error) {
        console.error('GET /api/orders failed:', error)
        return NextResponse.json({ orders: [] }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { items, userId, address } = await request.json()
        const client = await pool.connect()
        await client.query('BEGIN')

        const method = PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)]
        const { city = '', street = '', houseNumber = '', postalCode = '' } = address || {}

        const orderRes = await client.query<{ id: number }>(
            `INSERT INTO public.orders
         (user_id, order_date, status, payment_method, city, street, house_number, postal_code)
       VALUES
         ($1, NOW(), 'pending', $2, $3, $4, $5, $6)
       RETURNING id`,
            [userId, method, city, street, houseNumber, postalCode]
        )
        const orderId = orderRes.rows[0].id

        for (const { product, quantity } of items as Array<{ product: { id: number }; quantity: number }>) {
            await client.query(
                `INSERT INTO public.order_items (order_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
                [orderId, product.id, quantity]
            )
        }

        await client.query('COMMIT')
        client.release()
        return NextResponse.json({ orderId })
    } catch (error) {
        console.error('POST /api/orders failed:', error)
        try { await pool.query('ROLLBACK') } catch { }
        return NextResponse.json({ error: 'Не вдалося оформити замовлення.' }, { status: 500 })
    }
}
