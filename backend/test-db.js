const db = require('./config/db');

(async () => {
    try {
        const [rows] = await db.query('SHOW TABLES');
        console.log('Tables in database:', rows);

        const [users] = await db.query('SELECT * FROM users');
        console.log('Users:', users);
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
    } finally {
        process.exit();
    }
})();
