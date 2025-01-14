const db = require('../config/db');

const chatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', async ({ roomId, username }) => {
      socket.join(roomId);
      console.log(`${username} joined room ${roomId}`);

      try {
        const [messages] = await db.query(
          `SELECT m.id, m.message, m.timestamp, u.username AS sender, u.id AS userId
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

    socket.on('sendMessage', async ({ roomId, userId, message, tempId }) => { // Добавляем tempId
      try {
        const [rows] = await db.query('SELECT username FROM users WHERE id = ?', [userId]);
        const user = rows[0]; // Получаем первого пользователя из массива строк

        if (!user) {
          // Обработка случая, когда пользователь не найден
          console.error(`User with id ${userId} not found.`);
          return;
        }

        const [result] = await db.query(
          'INSERT INTO messages (room_id, user_id, message, sender, timestamp) VALUES (?, ?, ?, ?, NOW())',
          [roomId, userId, message, user.username]
        );

        const savedMessage = {
          id: result.insertId,
          roomId,
          userId, // Добавляем userId
          message,
          sender: user.username, // Убедимся, что поле sender присутствует
          timestamp: new Date().toISOString(),
          tempId, // Добавляем tempId к сообщению
        };

        console.log('Saved Message:', savedMessage); // Логирование для отладки

        io.to(roomId).emit('newMessage', savedMessage);
      } catch (err) {
        console.error('Error saving message:', err.message);
      }
    });

    socket.on('leaveRoom', ({ roomId, username }) => {
      socket.leave(roomId);
      console.log(`${username} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = chatSocket;
