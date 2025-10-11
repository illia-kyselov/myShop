# 🚀 Швидкий старт бази даних myShop

## 📋 Що потрібно зробити

1. ✅ Встановити PostgreSQL
2. ✅ Створити базу даних
3. ✅ Виконати SQL скрипти
4. ✅ Налаштувати .env
5. ✅ Запустити проект

---

## Крок 1: Встановлення PostgreSQL

### Windows (Рекомендовано)
1. Завантажте з https://www.postgresql.org/download/windows/
2. Запустіть інсталятор
3. Пароль для postgres: **запам'ятайте його!**
4. Порт: залиште `5432`

### За допомогою Docker (Альтернатива)
```bash
docker run --name myshop-db -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
```

---

## Крок 2: Створення бази даних

### Через командний рядок (psql)
```bash
# Підключіться до PostgreSQL
psql -U postgres

# В psql консолі виконайте:
CREATE DATABASE myshop;

# Вийдіть
\q
```

### Через pgAdmin
1. Відкрийте pgAdmin
2. Правий клік на "Databases" → Create → Database
3. Назва: `myshop`
4. Натисніть Save

---

## Крок 3: Виконання SQL скриптів

### Варіант A: Командний рядок (Рекомендовано)
```bash
# Перейдіть в папку проекту
cd C:\Users\illya\OneDrive\Desktop\myShop-main

# Створіть таблиці
psql -U postgres -d myshop -f setupBd/database-schema.sql

# Додайте тестові дані
psql -U postgres -d myshop -f setupBd/database-seed.sql
```

### Варіант B: pgAdmin
1. Відкрийте pgAdmin
2. Виберіть базу даних `myshop`
3. Натисніть Tools → Query Tool
4. Відкрийте файл `setupBd/database-schema.sql` (File → Open)
5. Натисніть Execute (F5)
6. Повторіть для `setupBd/database-seed.sql`

---

## Крок 4: Налаштування .env файлу

### Створіть файл `.env` в корені проекту:

```env
# Формат: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/myshop

# Згенеруйте секретний ключ (див. нижче)
JWT_SECRET=ваш-секретний-ключ-мінімум-32-символи

# Середовище
NODE_ENV=development
```

### Генерація JWT_SECRET:

**Варіант 1 - PowerShell:**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Варіант 2 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Варіант 3 - Онлайн:**
Відвідайте https://randomkeygen.com/

---

## Крок 5: Перевірка підключення

### Спосіб 1: SQL запит
```bash
psql -U postgres -d myshop -c "SELECT COUNT(*) FROM users;"
```

Має вивести: `count: 4` (1 admin + 3 users)

### Спосіб 2: Через проект
```bash
npm run dev
```

Відкрийте http://localhost:3000

---

## ✅ Перевірочний список

- [ ] PostgreSQL встановлено та запущено
- [ ] База даних `myshop` створена
- [ ] Таблиці створено (`database-schema.sql`)
- [ ] Тестові дані додано (`database-seed.sql`)
- [ ] Файл `.env` створено з правильним `DATABASE_URL`
- [ ] `JWT_SECRET` згенеровано та додано в `.env`
- [ ] `npm run dev` запускається без помилок
- [ ] Сторінка відкривається в браузері

---

## 🎯 Тестові акаунти

| Email | Пароль | Роль |
|-------|--------|------|
| admin@myshop.com | admin123 | Адміністратор |
| user1@gmail.com | user123 | Користувач |
| user2@gmail.com | user123 | Користувач |
| user3@gmail.com | user123 | Користувач |

---

## 🐛 Вирішення проблем

### Помилка: "ECONNREFUSED"
```bash
# Перевірте чи запущений PostgreSQL
# Windows:
services.msc → PostgreSQL → Запустити

# Або через командний рядок:
pg_ctl -D "C:\Program Files\PostgreSQL\16\data" status
```

### Помилка: "password authentication failed"
```bash
# Перевірте пароль в .env файлі
# DATABASE_URL=postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/myshop
```

### Помилка: "database myshop does not exist"
```bash
# Створіть базу даних:
psql -U postgres -c "CREATE DATABASE myshop;"
```

### Помилка: "relation products does not exist"
```bash
# Виконайте SQL скрипт для створення таблиць:
psql -U postgres -d myshop -f setupBd/database-schema.sql
```

---

## 📊 Корисні команди PostgreSQL

```sql
-- Перевірити всі таблиці
\dt

-- Подивитись дані в таблиці
SELECT * FROM users;
SELECT * FROM products LIMIT 5;

-- Підрахувати записи
SELECT COUNT(*) FROM products;

-- Видалити всі дані (обережно!)
TRUNCATE users, products, orders, order_items, product_views CASCADE;

-- Видалити базу даних (обережно!)
DROP DATABASE myshop;
```

---

## 🔄 Скидання бази даних

Якщо потрібно почати заново:

```bash
# 1. Видаліть існуючу базу
psql -U postgres -c "DROP DATABASE IF EXISTS myshop;"

# 2. Створіть нову
psql -U postgres -c "CREATE DATABASE myshop;"

# 3. Створіть таблиці
psql -U postgres -d myshop -f setupBd/database-schema.sql

# 4. Додайте дані
psql -U postgres -d myshop -f setupBd/database-seed.sql
```

---

**Успіхів! 🎉**

