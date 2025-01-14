// src/shared/socket.js
export default {
  emit: jest.fn(),
  on: jest.fn((event, callback) => {
    if (event === 'loadMessages') {
      callback([
        { id: 1, sender: 'User1', message: 'Привет!' },
        { id: 2, sender: 'User2', message: 'Как дела?' },
      ]);
    }
    if (event === 'newMessage') {
      callback({ id: 3, sender: 'User3', message: 'Новое сообщение' });
    }
  }),
};