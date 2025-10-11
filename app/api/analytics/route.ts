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

            case "kpi": {
                // Загальний дохід
                const revenueResult = await pool.query(`
                    SELECT COALESCE(SUM(oi.quantity * p.price * (1 - p.discount/100)), 0) as total_revenue
                    FROM orders o
                    JOIN order_items oi ON o.id = oi.order_id
                    JOIN products p ON oi.product_id = p.id
                    WHERE o.status = 'completed'
                `);
                
                // Кількість замовлень на день
                const ordersPerDayResult = await pool.query(`
                    SELECT COUNT(*) / GREATEST(EXTRACT(days FROM NOW() - MIN(order_date)), 1) as orders_per_day
                    FROM orders
                    WHERE order_date >= NOW() - INTERVAL '30 days'
                `);
                
                // Конверсія (замовлення / перегляди)
                const conversionResult = await pool.query(`
                    SELECT 
                        CASE 
                            WHEN (SELECT COUNT(*) FROM product_views) > 0 
                            THEN (SELECT COUNT(*) FROM orders) * 100.0 / (SELECT COUNT(*) FROM product_views)
                            ELSE 0 
                        END as conversion_rate
                `);
                
                // Середній чек
                const avgCheckResult = await pool.query(`
                    SELECT COALESCE(AVG(oi.quantity * p.price * (1 - p.discount/100)), 0) as avg_check
                    FROM orders o
                    JOIN order_items oi ON o.id = oi.order_id
                    JOIN products p ON oi.product_id = p.id
                    WHERE o.status = 'completed'
                `);
                
                // Кількість користувачів
                const usersResult = await pool.query(`
                    SELECT COUNT(*) as total_users FROM users
                `);

                const kpi = {
                    totalRevenue: Math.floor(revenueResult.rows[0]?.total_revenue || 0),
                    ordersPerDay: Math.floor(ordersPerDayResult.rows[0]?.orders_per_day || 0),
                    conversionRate: Math.floor(conversionResult.rows[0]?.conversion_rate || 0),
                    avgCheck: Math.floor(avgCheckResult.rows[0]?.avg_check || 0),
                    totalUsers: usersResult.rows[0]?.total_users || 0,
                };

                return NextResponse.json({ data: kpi });
            }

            case "topProducts": {
                const { rows } = await pool.query(`
                    SELECT 
                        p.id,
                        p.name,
                        p.price,
                        p.discount,
                        COALESCE(view_stats.views, 0) as views,
                        COALESCE(order_stats.orders, 0) as orders,
                        COALESCE(order_stats.revenue, 0) as revenue
                    FROM products p
                    LEFT JOIN (
                        SELECT 
                            product_id,
                            COUNT(*) as views
                        FROM product_views
                        GROUP BY product_id
                    ) view_stats ON p.id = view_stats.product_id
                    LEFT JOIN (
                        SELECT 
                            oi.product_id,
                            COUNT(DISTINCT oi.order_id) as orders,
                            SUM(oi.quantity * p.price * (1 - p.discount/100)) as revenue
                        FROM order_items oi
                        JOIN orders o ON oi.order_id = o.id
                        JOIN products p ON oi.product_id = p.id
                        WHERE o.status = 'completed'
                        GROUP BY oi.product_id
                    ) order_stats ON p.id = order_stats.product_id
                    WHERE view_stats.views > 0 OR order_stats.orders > 0
                    ORDER BY (view_stats.views + order_stats.orders * 10) DESC
                    LIMIT 20
                `);
                return NextResponse.json({ data: rows });
            }

            case "forecasts": {
                // Аналіз трендів для прогнозування
                
                // 1. Прогноз продажів наступного місяця
                const salesTrendResult = await pool.query(`
                    SELECT 
                        AVG(daily_sales) as avg_daily_sales,
                        COUNT(*) as days_count
                    FROM (
                        SELECT 
                            DATE(order_date) as order_day,
                            COUNT(*) as daily_sales
                        FROM orders 
                        WHERE status = 'completed' 
                        AND order_date >= NOW() - INTERVAL '30 days'
                        GROUP BY DATE(order_date)
                    ) daily_data
                `);
                
                const avgDailySales = salesTrendResult.rows[0]?.avg_daily_sales || 0;
                const nextMonthSales = Math.round(avgDailySales * 30 * 1.2); // +20% тренд
                
                // 2. Прогноз переглядів товарів
                const viewsTrendResult = await pool.query(`
                    SELECT 
                        AVG(daily_views) as avg_daily_views
                    FROM (
                        SELECT 
                            DATE(viewed_at) as view_day,
                            COUNT(*) as daily_views
                        FROM product_views 
                        WHERE viewed_at >= NOW() - INTERVAL '30 days'
                        GROUP BY DATE(viewed_at)
                    ) daily_data
                `);
                
                const avgDailyViews = viewsTrendResult.rows[0]?.avg_daily_views || 0;
                const nextMonthViews = Math.round(avgDailyViews * 30 * 1.15); // +15% тренд
                
                // 3. Прогноз нових користувачів (базується на реєстраціях)
                const usersTrendResult = await pool.query(`
                    SELECT 
                        AVG(daily_users) as avg_daily_users
                    FROM (
                        SELECT 
                            DATE(created_at) as user_day,
                            COUNT(*) as daily_users
                        FROM users 
                        WHERE created_at >= NOW() - INTERVAL '30 days'
                        GROUP BY DATE(created_at)
                    ) daily_data
                `);
                
                const avgDailyUsers = usersTrendResult.rows[0]?.avg_daily_users || 0;
                const nextWeekUsers = Math.round(avgDailyUsers * 7 * 1.1); // +10% тренд
                
                // 4. Прогноз середнього чека
                const avgCheckTrendResult = await pool.query(`
                    SELECT 
                        AVG(order_total) as avg_check,
                        COUNT(*) as order_count
                    FROM (
                        SELECT 
                            o.id,
                            SUM(oi.quantity * p.price * (1 - p.discount/100)) as order_total
                        FROM orders o
                        JOIN order_items oi ON o.id = oi.order_id
                        JOIN products p ON oi.product_id = p.id
                        WHERE o.status = 'completed'
                        AND o.order_date >= NOW() - INTERVAL '30 days'
                        GROUP BY o.id
                    ) order_totals
                `);
                
                const currentAvgCheck = avgCheckTrendResult.rows[0]?.avg_check || 0;
                const nextMonthAvgCheck = Math.round(currentAvgCheck * 1.05); // +5% тренд
                
                // 5. Прогноз конверсії
                const conversionTrendResult = await pool.query(`
                    SELECT 
                        (COUNT(DISTINCT o.user_id) * 100.0 / 
                         NULLIF((SELECT COUNT(DISTINCT pv.user_id) FROM product_views pv 
                                WHERE pv.viewed_at >= NOW() - INTERVAL '30 days'), 0)) as conversion_rate
                    FROM orders o
                    WHERE o.status = 'completed'
                    AND o.order_date >= NOW() - INTERVAL '30 days'
                `);
                
                const currentConversion = conversionTrendResult.rows[0]?.conversion_rate || 0;
                const nextMonthConversion = Math.round(currentConversion * 1.08); // +8% тренд

                const forecasts = [
                    {
                        metric: "Продажі наступного місяця",
                        current: Math.round(avgDailySales * 30),
                        forecast: nextMonthSales,
                        change: nextMonthSales > 0 ? ((nextMonthSales - (avgDailySales * 30)) / (avgDailySales * 30)) * 100 : 0,
                        period: "наступний місяць"
                    },
                    {
                        metric: "Перегляди товарів",
                        current: Math.round(avgDailyViews * 30),
                        forecast: nextMonthViews,
                        change: nextMonthViews > 0 ? ((nextMonthViews - (avgDailyViews * 30)) / (avgDailyViews * 30)) * 100 : 0,
                        period: "наступні 30 днів"
                    },
                    {
                        metric: "Нові користувачі",
                        current: Math.round(avgDailyUsers * 7),
                        forecast: nextWeekUsers,
                        change: nextWeekUsers > 0 ? ((nextWeekUsers - (avgDailyUsers * 7)) / (avgDailyUsers * 7)) * 100 : 0,
                        period: "наступний тиждень"
                    },
                    {
                        metric: "Середній чек",
                        current: Math.round(currentAvgCheck),
                        forecast: nextMonthAvgCheck,
                        change: nextMonthAvgCheck > 0 ? ((nextMonthAvgCheck - currentAvgCheck) / currentAvgCheck) * 100 : 0,
                        period: "наступний місяць"
                    },
                    {
                        metric: "Конверсія",
                        current: Math.round(currentConversion),
                        forecast: nextMonthConversion,
                        change: nextMonthConversion > 0 ? ((nextMonthConversion - currentConversion) / currentConversion) * 100 : 0,
                        period: "наступні 2 тижні"
                    }
                ];

                return NextResponse.json({ data: forecasts });
            }

            default:
                return NextResponse.json({ error: "Unknown metric" }, { status: 400 });
        }
    } catch (err) {
        console.error("Analytics API error:", err);
        return NextResponse.json({ data: [] }, { status: 500 });
    }
}
