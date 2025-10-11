/**
 * Утиліта для генерації bcrypt хешів паролів
 * 
 * Використання:
 * node setupBd/scripts/generate-password.js your-password
 * 
 * Або без аргументів для інтерактивного режиму
 */

const bcrypt = require('bcrypt');
const readline = require('readline');

const SALT_ROUNDS = 10;

async function generateHash(password) {
    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        console.log('\n✅ Bcrypt хеш згенеровано успішно!\n');
        console.log('Пароль:', password);
        console.log('Хеш:', hash);
        console.log('\nSQL приклад:');
        console.log(`INSERT INTO users (login, password, is_admin) VALUES ('user@example.com', '${hash}', FALSE);`);
        console.log('\n');
    } catch (error) {
        console.error('❌ Помилка генерації хешу:', error);
        process.exit(1);
    }
}

async function interactiveMode() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Введіть пароль для хешування: ', async (password) => {
        if (!password) {
            console.log('❌ Пароль не може бути порожнім!');
            rl.close();
            process.exit(1);
        }
        await generateHash(password);
        rl.close();
    });
}

// Головна логіка
const password = process.argv[2];

if (password) {
    generateHash(password).then(() => process.exit(0));
} else {
    console.log('🔐 Генератор bcrypt хешів для myShop\n');
    interactiveMode();
}

