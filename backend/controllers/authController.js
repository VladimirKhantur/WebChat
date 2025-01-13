const bcrypt = require('bcrypt');
const db = require('../config/db');

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

        res.status(200).json({ id: user.id, username: user.username, role: user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, email, role FROM users');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
