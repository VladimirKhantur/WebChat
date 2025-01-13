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
    const { name, userId } = req.body;

    try {
        const [result] = await db.query('INSERT INTO rooms (name, created_by) VALUES (?, ?)', [
            name,
            userId,
        ]);
        res.status(201).json({ id: result.insertId, name });
    } catch (err) {
        res.status(500).json({ message: err.message });
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