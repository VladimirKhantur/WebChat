const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const db = require('../config/db');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, username, email, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
