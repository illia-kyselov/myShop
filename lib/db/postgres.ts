import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function getProducts(limit = 50, offset = 0) {
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
}

export async function getProductsCount(): Promise<number> {
    const result = await pool.query(`
    SELECT COUNT(*) AS count
    FROM products;
  `);
    return parseInt(result.rows[0].count, 10);
}

export default pool;
