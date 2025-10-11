-- ==========================================
-- myShop Database Schema
-- PostgreSQL Database
-- ==========================================

-- Створення бази даних (виконайте окремо, якщо потрібно)
-- CREATE DATABASE myshop;

-- Підключіться до бази даних myshop перед виконанням наступних команд

-- ==========================================
-- 1. Таблиця користувачів (users)
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,  -- email користувача
    password VARCHAR(255) NOT NULL,       -- хешований пароль (bcrypt)
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    avatar VARCHAR(500),                  -- URL аватара (опціонально)
    created_at TIMESTAMP DEFAULT NOW()
);

-- Індекс для швидкого пошуку по email
CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);

-- ==========================================
-- 2. Таблиця товарів (products)
-- ==========================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    discount DECIMAL(5, 2) DEFAULT 0 CHECK (discount >= 0 AND discount <= 100),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Індекс для пошуку товарів
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- ==========================================
-- 3. Таблиця замовлень (orders)
-- ==========================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, processing, completed, cancelled
    payment_method VARCHAR(50),                      -- apple_pay, paypal, etc.
    city VARCHAR(255),
    street VARCHAR(255),
    house_number VARCHAR(50),
    postal_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Індекси для швидкого пошуку замовлень
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);

-- ==========================================
-- 4. Таблиця елементів замовлення (order_items)
-- ==========================================
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ==========================================
-- 5. Таблиця переглядів товарів (product_views)
-- ==========================================
CREATE TABLE IF NOT EXISTS product_views (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_id INTEGER,                      -- може бути NULL для неавторизованих
    viewed_at TIMESTAMP DEFAULT NOW(),
    platform VARCHAR(50) NOT NULL,        -- web, ios, android
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Індекси для аналітики
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_user_id ON product_views(user_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON product_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_product_views_platform ON product_views(platform);

-- ==========================================
-- Тестові дані (опціонально)
-- ==========================================

-- Створення тестового адміністратора
-- Пароль: admin123 (хеш згенерований через bcrypt з salt rounds = 10)
INSERT INTO users (login, password, is_admin) VALUES 
('admin@myshop.com', '$2b$10$YourHashedPasswordHere', TRUE)
ON CONFLICT (login) DO NOTHING;

-- Додавання тестових товарів
INSERT INTO products (name, image_url, price, discount, description) VALUES 
('Laptop HP Pavilion', 'https://example.com/laptop.jpg', 25999.00, 10, 'Потужний ноутбук для роботи та розваг'),
('iPhone 15 Pro', 'https://example.com/iphone.jpg', 39999.00, 5, 'Останній флагман від Apple'),
('Samsung Galaxy S24', 'https://example.com/samsung.jpg', 32999.00, 15, 'Флагманський смартфон Samsung'),
('iPad Air', 'https://example.com/ipad.jpg', 21999.00, 8, 'Планшет для творчості'),
('AirPods Pro', 'https://example.com/airpods.jpg', 8999.00, 0, 'Бездротові навушники з шумозаглушенням')
ON CONFLICT DO NOTHING;

-- ==========================================
-- Корисні запити для перевірки
-- ==========================================

-- Перевірити всі таблиці
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Подивитись структуру таблиці
-- \d users
-- \d products
-- \d orders
-- \d order_items
-- \d product_views

-- Підрахувати записи в кожній таблиці
-- SELECT 'users' as table_name, COUNT(*) as count FROM users
-- UNION ALL
-- SELECT 'products', COUNT(*) FROM products
-- UNION ALL
-- SELECT 'orders', COUNT(*) FROM orders
-- UNION ALL
-- SELECT 'order_items', COUNT(*) FROM order_items
-- UNION ALL
-- SELECT 'product_views', COUNT(*) FROM product_views;

