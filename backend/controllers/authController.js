const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Убедитесь, что у вас есть переменная окружения JWT_SECRET

// Функция регистрации пользователя
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email уже используется' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, passwordHash, role || 'user']
        );

        res.status(201).json({ id: result.insertId, username, email, role: role || 'user' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Функция входа пользователя
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Генерация JWT токена
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, id: user.id, username: user.username, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Функция получения списка пользователей
exports.getUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, role FROM users');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Middleware проверки роли пользователя
exports.checkRole = (requiredRole) => async (req, res, next) => {
    const { userId } = req.body;

    try {
        const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);
        const user = rows[0];
        if (!user || user.role !== requiredRole) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
