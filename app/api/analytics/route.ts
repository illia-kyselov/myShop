import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db/postgres";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const metric = searchParams.get("metric");
    const range = parseInt(searchParams.get("range") || "30", 10);
    if (!metric) {
        return NextResponse.json({ error: "metric параметр обов'язковий" }, { status: 400 });
    }
    const interval = `${range} days`;

    try {
        switch (metric) {
            case "dailyViews": {
                const { rows } = await pool.query(`
          SELECT
            to_char(date_trunc('day', viewed_at), 'DD.MM.YYYY') AS date,
            SUM(CASE WHEN platform = 'web' THEN 1 ELSE 0 END) AS web,
            SUM(CASE WHEN platform IN ('ios','android') THEN 1 ELSE 0 END) AS mobile
          FROM public.product_views
          WHERE viewed_at >= NOW() - INTERVAL '${interval}'
          GROUP BY date_trunc('day', viewed_at)
          ORDER BY date_trunc('day', viewed_at);
        `);
                return NextResponse.json({ data: rows });
            }

            case "monthlyViews": {
                const { rows } = await pool.query(`
          SELECT
            to_char(date_trunc('month', viewed_at), 'MM.YYYY') AS month,
            SUM(CASE WHEN platform = 'web' THEN 1 ELSE 0 END) AS web,
            SUM(CASE WHEN platform IN ('ios','android') THEN 1 ELSE 0 END) AS mobile
          FROM public.product_views
          WHERE viewed_at >= NOW() - INTERVAL '${interval}'
          GROUP BY date_trunc('month', viewed_at)
          ORDER BY date_trunc('month', viewed_at);
        `);
                return NextResponse.json({ data: rows });
            }

            case "platformViews": {
                const { rows } = await pool.query(`
          SELECT
            platform,
            COUNT(*) AS count
          FROM public.product_views
          WHERE viewed_at >= NOW() - INTERVAL '${interval}'
          GROUP BY platform;
        `);
                return NextResponse.json({ data: rows });
            }

            case "monthlyOrders": {
                const { rows } = await pool.query(`
          SELECT
            to_char(date_trunc('month', o.order_date), 'MM.YYYY') AS month,
            SUM(CASE WHEN pv.platform = 'web' THEN 1 ELSE 0 END) AS desktop,
            SUM(CASE WHEN pv.platform IN ('ios','android') THEN 1 ELSE 0 END) AS mobile
          FROM public.orders o
          LEFT JOIN public.product_views pv
            ON pv.user_id = o.user_id  -- умовний приклад, можна інші join
            AND date_trunc('month', pv.viewed_at) = date_trunc('month', o.order_date)
          WHERE o.order_date >= NOW() - INTERVAL '${interval}'
          GROUP BY date_trunc('month', o.order_date)
          ORDER BY date_trunc('month', o.order_date);
        `);
                return NextResponse.json({ data: rows });
            }

            default:
                return NextResponse.json({ error: "Unknown metric" }, { status: 400 });
        }
    } catch (err) {
        console.error("Analytics API error:", err);
        return NextResponse.json({ data: [] }, { status: 500 });
    }
}
