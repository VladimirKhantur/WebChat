// controllers/chatController.js

const db = require('../config/db');

exports.getRooms = async (req, res) => {
    try {
        const [rooms] = await db.query('SELECT * FROM rooms');
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    console.log('Request received for /rooms');
};

exports.createRoom = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id; // Предполагается, что вы уже настроили аутентификацию и добавили userId в req

    if (!name) {
        return res.status(400).json({ message: 'Название комнаты не может быть пустым.' });
    }

    try {
        const [result] = await db.query('INSERT INTO rooms (name, created_by) VALUES (?, ?)', [
            name,
            userId,
        ]);
        res.status(201).json({ id: result.insertId, name });
    } catch (err) {
        console.error('Ошибка при создании комнаты:', err);
        res.status(500).json({ message: 'Не удалось создать комнату.' });
    }
};

exports.getMessages = async (req, res) => {
    const { roomId } = req.params;

    try {
        const [messages] = await db.query(
            `SELECT m.id, m.message, m.timestamp, u.username AS sender 
             FROM messages m 
             JOIN users u ON m.user_id = u.id 
             WHERE m.room_id = ? 
             ORDER BY m.timestamp ASC`,
            [roomId]
        );

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
