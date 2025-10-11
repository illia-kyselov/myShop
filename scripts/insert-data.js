const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Підключення до БД
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/myshop'
});

async function insertData() {
    const client = await pool.connect();
    
    try {
        console.log('🔄 Початок додавання тестових даних...');
        
        // 1. Додати користувачів
        console.log('👤 Додаємо користувачів...');
        
        // Генеруємо хеш для пароля "admin123"
        const adminHash = await bcrypt.hash('admin123', 10);
        const userHash = await bcrypt.hash('user123', 10);
        
        await client.query(`
            INSERT INTO users (login, password, is_admin) VALUES 
            ($1, $2, TRUE),
            ($3, $4, FALSE),
            ($5, $4, FALSE),
            ($6, $4, FALSE)
            ON CONFLICT (login) DO NOTHING
        `, [
            'admin@myshop.com', adminHash,
            'user1@gmail.com', userHash,
            'user2@gmail.com', userHash,
            'user3@gmail.com', userHash
        ]);
        
        // 2. Додати товари
        console.log('📦 Додаємо товари...');
        
        const products = [
            ['MacBook Air M2', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 48999.00, 5, 'Тонкий та легкий ноутбук з чіпом Apple M2. Неймовірна продуктивність та автономність до 18 годин.'],
            ['ASUS ROG Gaming Laptop', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302', 42999.00, 15, 'Ігровий ноутбук з RTX 4060, 32GB RAM, 1TB SSD. Для справжніх геймерів.'],
            ['Laptop HP Pavilion 15', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 25999.00, 10, 'Потужний ноутбук з процесором Intel Core i5, 16GB RAM, 512GB SSD. Ідеальний для роботи та навчання.'],
            ['iPhone 15 Pro Max', 'https://images.unsplash.com/photo-1592286927505-2fd143f32e6f', 45999.00, 5, 'Флагман від Apple з титановим корпусом, чіпом A17 Pro та камерою 48MP.'],
            ['Samsung Galaxy S24 Ultra', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c', 38999.00, 12, 'Потужний смартфон з S Pen, камерою 200MP та дисплеєм 6.8" Dynamic AMOLED.'],
            ['Google Pixel 8 Pro', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97', 32999.00, 8, 'Смартфон з найкращою камерою та чистим Android. Tensor G3 чіп.'],
            ['OnePlus 12', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 27999.00, 10, 'Швидкий смартфон з Snapdragon 8 Gen 3, швидка зарядка 100W.'],
            ['iPad Air M2', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0', 24999.00, 8, 'Універсальний планшет для роботи та творчості. Підтримка Apple Pencil.'],
            ['Samsung Galaxy Tab S9', 'https://images.unsplash.com/photo-1585790050230-5dd28404f869', 22999.00, 10, 'Планшет преміум класу з AMOLED дисплеєм та S Pen в комплекті.'],
            ['iPad Pro 12.9"', 'https://images.unsplash.com/photo-1561154464-82e9adf32764', 52999.00, 5, 'Професійний планшет з чіпом M2, дисплеєм Liquid Retina XDR.'],
            ['AirPods Pro 2', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46', 9999.00, 0, 'Бездротові навушники з активним шумозаглушенням та просторовим звуком.'],
            ['Sony WH-1000XM5', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b', 12999.00, 15, 'Найкраще шумозаглушення на ринку. 30 годин автономності.'],
            ['Samsung Galaxy Buds2 Pro', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', 6999.00, 10, 'Компактні бездротові навушники з шумозаглушенням та Hi-Fi звуком.'],
            ['Beats Studio Pro', 'https://images.unsplash.com/photo-1484704849700-f032a568e944', 11999.00, 12, 'Стильні навушники з просторовим звуком та USB-C зарядкою.'],
            ['Apple Watch Series 9', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a', 17999.00, 8, 'Розумний годинник з датчиком здоров\'я, GPS та Always-On дисплеєм.'],
            ['Samsung Galaxy Watch 6', 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf', 12999.00, 10, 'Елегантний смарт-годинник з аналізом сну та фітнес-функціями.'],
            ['Magic Keyboard для iPad', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3', 11999.00, 0, 'Клавіатура з трекпадом та підсвічуванням для iPad Pro.'],
            ['Logitech MX Master 3S', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', 3999.00, 15, 'Найкраща бездротова миша для продуктивності. 8K DPI сенсор.'],
            ['Anker PowerCore 20000mAh', 'https://images.unsplash.com/photo-1609592419660-92f61d5c7588', 1999.00, 20, 'Потужний павербанк з швидкою зарядкою USB-C PD 30W.'],
            ['GoPro Hero 12', 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396', 18999.00, 10, 'Екшн-камера 5.3K з стабілізацією та водонепроникністю до 10м.'],
            ['DJI Mini 4 Pro', 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9', 32999.00, 8, 'Компактний дрон з 4K камерою та часом польоту до 34 хвилин.'],
            ['JBL Flip 6', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', 3999.00, 12, 'Портативна колонка з потужним звуком та захистом IP67.'],
            ['Bose SoundLink Revolve+', 'https://images.unsplash.com/photo-1545454675-3531b543be5d', 8999.00, 15, 'Колонка з 360° звуком та автономністю до 16 годин.'],
            ['PlayStation 5', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db', 19999.00, 5, 'Нового покоління консоль з SSD та підтримкою 4K 120fps.'],
            ['Xbox Series X', 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d', 18999.00, 5, 'Потужна консоль з Quick Resume та Game Pass.'],
            ['Nintendo Switch OLED', 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e', 12999.00, 8, 'Портативна консоль з яскравим OLED екраном 7".'],
            ['Logitech MX Keys', 'https://images.unsplash.com/photo-1595225476474-87563907a212', 4999.00, 10, 'Бездротова клавіатура для професіоналів з підсвічуванням.'],
            ['Keychron K8 Pro', 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef', 5999.00, 12, 'Механічна клавіатура з hot-swap перемикачами.'],
            ['Dell UltraSharp 27" 4K', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', 16999.00, 10, 'Професійний монітор з IPS матрицею та калібруванням кольорів.'],
            ['LG UltraGear 32" Gaming', 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2', 14999.00, 15, 'Ігровий монітор 165Hz з G-Sync та HDR10.']
        ];
        
        for (const product of products) {
            await client.query(`
                INSERT INTO products (name, image_url, price, discount, description) 
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT DO NOTHING
            `, product);
        }
        
        // 3. Додати замовлення
        console.log('🛒 Додаємо замовлення...');
        
        await client.query(`
            INSERT INTO orders (user_id, order_date, status, payment_method, city, street, house_number, postal_code)
            VALUES 
            (2, NOW() - INTERVAL '5 days', 'completed', 'apple_pay', 'Київ', 'вул. Хрещатик', '1', '01001'),
            (2, NOW() - INTERVAL '2 days', 'processing', 'paypal', 'Київ', 'вул. Хрещатик', '1', '01001'),
            (3, NOW() - INTERVAL '7 days', 'completed', 'paypal', 'Львів', 'пр. Свободи', '15', '79000'),
            (3, NOW() - INTERVAL '1 day', 'pending', 'apple_pay', 'Львів', 'пр. Свободи', '15', '79000')
            ON CONFLICT DO NOTHING
        `);
        
        // 4. Додати елементи замовлень
        console.log('📋 Додаємо елементи замовлень...');
        
        await client.query(`
            INSERT INTO order_items (order_id, product_id, quantity) VALUES 
            (1, 4, 1), (1, 11, 1),
            (2, 1, 1),
            (3, 2, 1), (3, 18, 1),
            (4, 8, 1), (4, 17, 1)
            ON CONFLICT DO NOTHING
        `);
        
        // 5. Додати перегляди
        console.log('📊 Додаємо перегляди товарів...');
        
        await client.query(`
            INSERT INTO product_views (product_id, user_id, viewed_at, platform) VALUES 
            (1, 2, NOW() - INTERVAL '1 day', 'web'),
            (2, 2, NOW() - INTERVAL '1 day', 'web'),
            (3, 3, NOW() - INTERVAL '2 days', 'web'),
            (4, 2, NOW() - INTERVAL '3 days', 'web'),
            (5, 3, NOW() - INTERVAL '3 days', 'web'),
            (1, 2, NOW() - INTERVAL '5 days', 'ios'),
            (4, 2, NOW() - INTERVAL '5 days', 'ios'),
            (11, 3, NOW() - INTERVAL '6 days', 'ios'),
            (5, 3, NOW() - INTERVAL '7 days', 'android'),
            (6, 2, NOW() - INTERVAL '8 days', 'android'),
            (7, 3, NOW() - INTERVAL '9 days', 'android'),
            (4, NULL, NOW() - INTERVAL '10 days', 'web'),
            (4, NULL, NOW() - INTERVAL '11 days', 'web'),
            (4, NULL, NOW() - INTERVAL '12 days', 'ios'),
            (2, NULL, NOW() - INTERVAL '13 days', 'web'),
            (2, NULL, NOW() - INTERVAL '14 days', 'android'),
            (11, NULL, NOW() - INTERVAL '15 days', 'web')
            ON CONFLICT DO NOTHING
        `);
        
        // Перевірка результатів
        console.log('\n📊 Статистика після додавання:');
        
        const usersCount = await client.query('SELECT COUNT(*) FROM users');
        const productsCount = await client.query('SELECT COUNT(*) FROM products');
        const ordersCount = await client.query('SELECT COUNT(*) FROM orders');
        const orderItemsCount = await client.query('SELECT COUNT(*) FROM order_items');
        const viewsCount = await client.query('SELECT COUNT(*) FROM product_views');
        
        console.log(`   👤 Користувачів: ${usersCount.rows[0].count}`);
        console.log(`   📦 Товарів: ${productsCount.rows[0].count}`);
        console.log(`   🛒 Замовлень: ${ordersCount.rows[0].count}`);
        console.log(`   📋 Елементів замовлень: ${orderItemsCount.rows[0].count}`);
        console.log(`   📊 Переглядів: ${viewsCount.rows[0].count}`);
        
        console.log('\n👤 Тестові акаунти:');
        console.log('   Admin: admin@myshop.com / admin123');
        console.log('   User1: user1@gmail.com / user123');
        console.log('   User2: user2@gmail.com / user123');
        console.log('   User3: user3@gmail.com / user123');
        
        console.log('\n✅ Тестові дані успішно додано!');
        
    } catch (error) {
        console.error('❌ Помилка при додаванні даних:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Запуск скрипта
insertData()
    .then(() => {
        console.log('\n🎉 Готово! Тепер можете запустити npm run dev');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Критична помилка:', error);
        process.exit(1);
    });
