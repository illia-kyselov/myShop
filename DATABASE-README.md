# 🗄️ Налаштування бази даних myShop

## ⚠️ Важлива інформація

Якщо ви бачите помилку **ECONNREFUSED** або сторінка не показує товари - вам потрібно налаштувати базу даних PostgreSQL.

---

## 🚀 Швидкий старт (3 команди):

```bash
# 1. Створіть базу даних
psql -U postgres -c "CREATE DATABASE myshop;"

# 2. Створіть таблиці та додайте тестові дані
psql -U postgres -d myshop -f setupBd/database-schema.sql
psql -U postgres -d myshop -f setupBd/database-seed.sql

# 3. Створіть .env файл (замініть "password" на ваш пароль PostgreSQL)
echo DATABASE_URL=postgresql://postgres:password@localhost:5432/myshop > .env
echo JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))") >> .env
echo NODE_ENV=development >> .env
```

Потім запустіть: `npm run dev`

---

## 📁 Вся документація знаходиться в папці **`setupBd/`**

### Почніть тут:
➡️ **`setupBd/START-HERE.md`** - Головна інструкція

### Інші корисні файли:
- `setupBd/QUICK-START.md` - Покрокова інструкція
- `setupBd/database-schema.sql` - SQL для створення таблиць
- `setupBd/database-seed.sql` - Тестові дані (30 товарів)
- `setupBd/CHATGPT-PROMPT.md` - Промпт для ChatGPT
- `setupBd/FILES-README.md` - Опис всіх файлів
- `setupBd/scripts/generate-password.js` - Генератор паролів

---

## 🎯 Тестові акаунти (після налаштування):

| Email | Пароль | Роль |
|-------|--------|------|
| admin@myshop.com | admin123 | Адміністратор |
| user1@gmail.com | user123 | Користувач |
| user2@gmail.com | user123 | Користувач |

---

## 📊 Структура БД:

Проект використовує **5 таблиць PostgreSQL**:
- **users** - Користувачі та адміністратори
- **products** - Каталог товарів (30 тестових товарів)
- **orders** - Замовлення користувачів
- **order_items** - Товари в замовленнях
- **product_views** - Аналітика переглядів

---

## ✅ Що робити далі:

1. 📖 Відкрийте `setupBd/START-HERE.md`
2. 🔧 Слідуйте інструкціям
3. ✨ Насолоджуйтесь магазином з повною БД!

---

**Потрібна допомога?** → Дивіться `setupBd/QUICK-START.md` для детальних інструкцій.

