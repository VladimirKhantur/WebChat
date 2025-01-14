const express = require('express');
const { register, login, getUsers } = require('../controllers/authController');
const router = express.Router();

// Маршрут регистрации
router.post('/register', register);

// Маршрут входа
router.post('/login', login);

// Маршрут получения списка пользователей (если он вам действительно нужен)
router.get('/', getUsers);

module.exports = router;
