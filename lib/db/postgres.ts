import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    password: '6006059a',
    host: 'localhost',
    port: 5432,
    database: 'myShop',
});

export async function getProducts(limit = 50, offset = 0) {
    try {
        const result = await pool.query(
            `
    SELECT id, name, image_url, price, discount, description
    FROM products
    ORDER BY id
    LIMIT $1 OFFSET $2;
  `,
            [limit, offset]
        );
        return result.rows;
    } catch (error) {
        console.warn('⚠️ Database connection failed, returning empty array. See setupBd/START-HERE.md to setup database.');
        return [];
    }
}

export async function getProductsCount(): Promise<number> {
    try {
        const result = await pool.query(`
    SELECT COUNT(*) AS count
    FROM products;
  `);
        return parseInt(result.rows[0].count, 10);
    } catch (error) {
        console.warn('⚠️ Database connection failed, returning 0. See setupBd/START-HERE.md to setup database.');
        return 0;
    }
}

export default pool;
