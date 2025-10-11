# 🎯 ПОЧНІТЬ ЗВІДСИ - Відновлення бази даних myShop

> **✅ Ваша база даних була проаналізована та документована!**

---

## 🚀 ЩО РОБИТИ ДАЛІ (3 простих кроки):

### Крок 1️⃣: Створіть базу даних PostgreSQL
```bash
psql -U postgres -c "CREATE DATABASE myshop;"
```

### Крок 2️⃣: Виконайте SQL скрипти
```bash
# Створіть структуру таблиць
psql -U postgres -d myshop -f setupBd/database-schema.sql

# Додайте тестові дані
psql -U postgres -d myshop -f setupBd/database-seed.sql
```

### Крок 3️⃣: Налаштуйте .env файл
Створіть файл `.env` в корені проекту:
```env
DATABASE_URL=postgresql://postgres:ваш_пароль@localhost:5432/myshop
JWT_SECRET=згенеруйте_секретний_ключ_32_символи
NODE_ENV=development
```

**Генерація JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📁 ФАЙЛИ В ПАПЦІ setupBd:

### 🔴 ОСНОВНІ (обов'язкові)
1. **`database-schema.sql`** - Структура БД (таблиці, індекси, foreign keys)
2. **`database-seed.sql`** - Тестові дані (30 товарів, 4 користувачі, замовлення)
3. **`QUICK-START.md`** - Швидка інструкція за 5 хвилин

### 🟡 ДОПОМІЖНІ (для довідки)
4. **`FULL-GUIDE.md`** - Детальна документація
5. **`CHATGPT-PROMPT.md`** - Промпт для ChatGPT
6. **`FILES-README.md`** - Опис всіх файлів
7. **`scripts/generate-password.js`** - Генератор паролів

---

## 📊 СТРУКТУРА ВАШОЇ БАЗИ ДАНИХ:

```
PostgreSQL Database: myshop
│
├── 👤 users (Користувачі)
│   └── id, login, password, is_admin, avatar
│
├── 📦 products (Товари)
│   └── id, name, image_url, price, discount, description
│
├── 🛒 orders (Замовлення)
│   └── id, user_id, order_date, status, payment_method, адреса
│
├── 📋 order_items (Елементи замовлення)
│   └── id, order_id, product_id, quantity
│
└── 📊 product_views (Аналітика переглядів)
    └── id, product_id, user_id, viewed_at, platform
```

---

## 🎓 ТЕСТОВІ АКАУНТИ:

| Email | Пароль | Роль |
|-------|--------|------|
| admin@myshop.com | admin123 | Адміністратор |
| user1@gmail.com | user123 | Користувач |
| user2@gmail.com | user123 | Користувач |

**Тестові товари:** 30 товарів (iPhone, MacBook, Samsung, iPad тощо)

---

## ⚡ ШВИДКИЙ СТАРТ:

```bash
# 1. Створіть БД
psql -U postgres -c "CREATE DATABASE myshop;"

# 2. Виконайте скрипти
psql -U postgres -d myshop -f setupBd/database-schema.sql
psql -U postgres -d myshop -f setupBd/database-seed.sql

# 3. Створіть .env (замініть "password" на ваш пароль)
echo DATABASE_URL=postgresql://postgres:password@localhost:5432/myshop > .env
echo JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") >> .env
echo NODE_ENV=development >> .env

# 4. Запустіть проект
npm run dev
```

Відкрийте http://localhost:3000 🎉

---

## ✅ ПЕРЕВІРОЧНИЙ СПИСОК:

- [ ] PostgreSQL встановлено та запущено
- [ ] База даних `myshop` створена
- [ ] `database-schema.sql` виконано
- [ ] `database-seed.sql` виконано
- [ ] Файл `.env` створено
- [ ] `DATABASE_URL` правильний
- [ ] `JWT_SECRET` згенеровано
- [ ] `npm run dev` запускається без ECONNREFUSED
- [ ] Сторінка відкривається і показує товари
- [ ] Можна увійти (admin@myshop.com / admin123)

---

## 🆘 ПРОБЛЕМИ?

### ❌ "ECONNREFUSED"
- Перевірте чи запущений PostgreSQL
- Перевірте DATABASE_URL в .env
- Windows: services.msc → PostgreSQL → Запустити

### ❌ "relation products does not exist"
```bash
psql -U postgres -d myshop -f setupBd/database-schema.sql
```

### ❌ Немає PostgreSQL
- Windows: https://www.postgresql.org/download/windows/
- Docker: `docker run --name myshop-db -e POSTGRES_PASSWORD=mypass -p 5432:5432 -d postgres`
- Онлайн: https://supabase.com

---

## 📚 ДЕТАЛЬНІ ІНСТРУКЦІЇ:

- **Для початківців:** Відкрийте `setupBd/QUICK-START.md`
- **Для досвідчених:** Відкрийте `setupBd/FULL-GUIDE.md`
- **Потрібна допомога AI:** Відкрийте `setupBd/CHATGPT-PROMPT.md`

---

**Успіхів! 🚀**

