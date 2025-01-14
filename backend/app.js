const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes'); // Если у вас есть маршрут для пользователя

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Подключение маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes); // Подключение маршрута пользователя, если необходимо

// Обработка несуществующих маршрутов
app.use((req, res, next) => {
    res.status(404).json({ message: 'Маршрут не найден' });
});

module.exports = app;
