const db = require('../config/db');

const Room = {
    create: async (name, createdBy) => {
        const [result] = await db.query('INSERT INTO rooms (name, created_by) VALUES (?, ?)', [
            name,
            createdBy,
        ]);
        return result.insertId;
    },
    findAll: async () => {
        const [rows] = await db.query('SELECT * FROM rooms');
        return rows;
    },
};

module.exports = Room;
