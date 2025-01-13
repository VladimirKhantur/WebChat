const db = require('./config/db');

(async () => {
    try {
        // Тестируем подключение к базе данных
        const [rows] = await db.query('SHOW TABLES');
        console.log('Tables in database:', rows);

        // Проверяем данные в таблице users
        const [users] = await db.query('SELECT * FROM users');
        console.log('Users:', users);
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
    } finally {
        process.exit();
    }
})();
