const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const chatSocket = require('./socket/chatSocket'); // Убедитесь, что этот файл существует

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

chatSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
