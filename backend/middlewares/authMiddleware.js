const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Ожидаем формат "Bearer TOKEN"

    if (!token) {
        console.log('Токен отсутствует');
        return res.status(401).json({ message: 'Доступ запрещён: отсутствует токен' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Ошибка при проверке токена:', err.message);
            return res.status(403).json({ message: 'Доступ запрещён: неверный токен' });
        }
        req.user = user; 
        next();
    });
};

module.exports = authenticateToken;
