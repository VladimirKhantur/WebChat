const db = require('../config/db');

const checkRole = (requiredRole) => async (req, res, next) => {
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

module.exports = { checkRole };
