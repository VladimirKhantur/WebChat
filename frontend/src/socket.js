import { io } from "socket.io-client";

// Подключение к серверу WebSocket
const socket = io("http://localhost:3000");

export default socket;



