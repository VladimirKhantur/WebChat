// routes/chatRoutes.js

const express = require('express');
const { getRooms, createRoom, getMessages } = require('../controllers/chatController');
const router = express.Router();

// Применение аутентификационного middleware, если необходимо
const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware);

router.get('/rooms', getRooms);
router.post('/rooms', createRoom);
router.get('/rooms/:roomId/messages', getMessages);

module.exports = router;
