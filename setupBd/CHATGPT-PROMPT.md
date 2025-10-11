# 🤖 Промпт для ChatGPT - Створення бази даних myShop

## Копіюйте цей текст в ChatGPT:

---

Привіт! Мені потрібна допомога в створенні PostgreSQL бази даних для мого інтернет-магазину.

**Назва проекту:** myShop  
**СУБД:** PostgreSQL  
**Мова програмування:** Node.js з TypeScript  
**ORM/Driver:** pg (node-postgres)

## Структура бази даних:

### Таблиця 1: users
- `id` - SERIAL PRIMARY KEY
- `login` - VARCHAR(255) UNIQUE NOT NULL (email користувача)
- `password` - VARCHAR(255) NOT NULL (bcrypt хеш)
- `is_admin` - BOOLEAN NOT NULL DEFAULT FALSE
- `avatar` - VARCHAR(500) NULL (URL)
- `created_at` - TIMESTAMP DEFAULT NOW()

**Індекс:** login

---

### Таблиця 2: products
- `id` - SERIAL PRIMARY KEY
- `name` - VARCHAR(255) NOT NULL
- `image_url` - VARCHAR(500) NOT NULL
- `price` - DECIMAL(10,2) NOT NULL CHECK >= 0
- `discount` - DECIMAL(5,2) DEFAULT 0 CHECK (0-100)
- `description` - TEXT
- `created_at` - TIMESTAMP DEFAULT NOW()

**Індекс:** name

---

### Таблиця 3: orders
- `id` - SERIAL PRIMARY KEY
- `user_id` - INTEGER NOT NULL → FOREIGN KEY users(id) ON DELETE CASCADE
- `order_date` - TIMESTAMP DEFAULT NOW()
- `status` - VARCHAR(50) NOT NULL DEFAULT 'pending' (pending/processing/completed/cancelled)
- `payment_method` - VARCHAR(50) (apple_pay, paypal)
- `city` - VARCHAR(255)
- `street` - VARCHAR(255)
- `house_number` - VARCHAR(50)
- `postal_code` - VARCHAR(20)
- `created_at` - TIMESTAMP DEFAULT NOW()

**Індекси:** user_id, status, order_date

---

### Таблиця 4: order_items
- `id` - SERIAL PRIMARY KEY
- `order_id` - INTEGER NOT NULL → FOREIGN KEY orders(id) ON DELETE CASCADE
- `product_id` - INTEGER NOT NULL → FOREIGN KEY products(id) ON DELETE CASCADE
- `quantity` - INTEGER NOT NULL CHECK > 0
- `created_at` - TIMESTAMP DEFAULT NOW()

**Індекси:** order_id, product_id

---

### Таблиця 5: product_views (для аналітики)
- `id` - SERIAL PRIMARY KEY
- `product_id` - INTEGER NOT NULL → FOREIGN KEY products(id) ON DELETE CASCADE
- `user_id` - INTEGER NULL → FOREIGN KEY users(id) ON DELETE SET NULL
- `viewed_at` - TIMESTAMP DEFAULT NOW()
- `platform` - VARCHAR(50) NOT NULL ('web', 'ios', 'android')

**Індекси:** product_id, user_id, viewed_at, platform

---

## Що мені потрібно:

1. **Повний SQL скрипт** для створення всіх таблиць з:
   - CREATE TABLE командами
   - Всіма foreign keys
   - Всіма constraints (CHECK, UNIQUE, NOT NULL)
   - Індексами для оптимізації

2. **SQL скрипт з тестовими даними:**
   - 1 адміністратор (admin@myshop.com / admin123)
   - 2-3 звичайних користувачів
   - 10-15 товарів (електроніка: ноутбуки, телефони, планшети, навушники)
   - 2-3 тестових замовлення
   - Кілька order_items
   - 10-20 product_views для різних платформ

3. **Приклад .env конфігурації** для підключення через node-postgres

4. **Приклад Node.js коду** для підключення до бази даних через pg Pool

5. **Інструкції** як:
   - Створити базу даних
   - Виконати SQL скрипти
   - Перевірити що все працює
   - Згенерувати bcrypt хеш для паролів

---

**ВАЖЛИВО:**
- Використовуй `ON DELETE CASCADE` для orders та order_items
- Використовуй `ON DELETE SET NULL` для product_views.user_id
- Всі паролі хешуй через bcrypt з salt rounds = 10
- Для тестових даних використовуй реальні назви товарів
- Ціни вказуй в гривнях (UAH), діапазон 1000-50000
- Знижки від 0 до 20%

Дякую! Чекаю на детальну відповідь з усіма скриптами та інструкціями.

---

## Альтернативний короткий промпт:

---

Створи PostgreSQL базу даних для інтернет-магазину з таблицями: users (login, password, is_admin), products (name, image_url, price, discount, description), orders (user_id, order_date, status, payment_method, адреса), order_items (order_id, product_id, quantity), product_views (product_id, user_id, viewed_at, platform). 

Потрібно:
1. SQL скрипт для створення таблиць з foreign keys та індексами
2. SQL скрипт з тестовими даними (адмін, користувачі, 15 товарів електроніки, замовлення)
3. Node.js приклад підключення через pg library
4. .env конфігурацію

Паролі через bcrypt (10 rounds). Використай CASCADE та SET NULL де потрібно.

---

## Після отримання відповіді від ChatGPT:

1. Збережіть SQL скрипти у файли `.sql`
2. Перевірте структуру таблиць
3. Виконайте скрипти у вашій базі даних
4. Налаштуйте `.env` файл
5. Запустіть `npm run dev` для перевірки

---

**Готово! 🎉**

