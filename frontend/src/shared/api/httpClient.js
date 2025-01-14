import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:3000', 
});

// Добавляем интерсептор для автоматического добавления токена к каждому запросу
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Предполагаем, что токен сохраняется под ключом 'token'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { httpClient };

export const login = async (email, password) => {
  const response = await httpClient.post('/api/auth/login', { email, password });
  const { token, ...userData } = response.data;
  localStorage.setItem('token', token); // Сохраняем токен
  localStorage.setItem('user', JSON.stringify(userData)); // Сохраняем данные пользователя, если необходимо
  return token;
};

export const register = async (username, email, password) => {
  await httpClient.post('/api/auth/register', { username, email, password });
};

export const fetchRooms = async () => {
  const response = await httpClient.get('/api/rooms');
  return response.data;
};

export const fetchMessages = async (roomId) => {
  const response = await httpClient.get(`/api/rooms/${roomId}/messages`);
  return response.data;
};

export const sendMessageToRoom = async (roomId, text) => {
  await httpClient.post(`/api/rooms/${roomId}/messages`, { text });
};

export const createRoom = async (name) => {
  const response = await httpClient.post('/api/rooms', { name });
  return response.data; // Вернём данные о новой комнате
};

export const fetchUserData = async () => {
  try {
    const response = await httpClient.get('/api/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
