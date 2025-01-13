const db = require('../config/db');

const Message = {
    create: async (roomId, userId, message) => {
        const [result] = await db.query(
            'INSERT INTO messages (room_id, user_id, message) VALUES (?, ?, ?)',
            [roomId, userId, message]
        );
        return result.insertId;
    },
    findByRoom: async (roomId) => {
        const [rows] = await db.query('SELECT * FROM messages WHERE room_id = ?', [roomId]);
        return rows;
    },
};

module.exports = Message;
