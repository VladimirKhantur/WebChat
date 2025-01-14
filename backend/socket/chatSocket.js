const db = require('../config/db');

const chatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinRoom', async ({ roomId, username }) => {
            socket.join(roomId);
            console.log(`${username} joined room ${roomId}`);


            try {
                const [messages] = await db.query(
                    `SELECT m.id, m.message, m.timestamp, u.username AS sender 
                     FROM messages m 
                     JOIN users u ON m.user_id = u.id 
                     WHERE m.room_id = ? 
                     ORDER BY m.timestamp ASC`,
                    [roomId]
                );
  
                socket.emit('loadMessages', messages);
            } catch (err) {
                console.error('Error loading messages:', err.message);
            }
        });


        socket.on('sendMessage', async ({ roomId, userId, message }) => {
            try {
                const [user] = await db.query('SELECT username FROM users WHERE id = ?', [userId]);
                const [result] = await db.query(
                    'INSERT INTO messages (room_id, user_id, message, sender, timestamp) VALUES (?, ?, ?, ?, NOW())',
                    [roomId, userId, message,user.username]
                );

                const savedMessage = {
                    id: result.insertId,
                    roomId,
                    userId,
                    message,
                    sender:user.username,
                    timestamp: new Date().toISOString(),
                };

                io.to(roomId).emit('newMessage', savedMessage);
            } catch (err) {
                console.error('Error saving message:', err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = chatSocket;
