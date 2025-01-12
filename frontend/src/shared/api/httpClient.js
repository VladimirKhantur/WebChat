import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:3000', 
});

export const login = async (email, password) => {
  const response = await httpClient.post('/api/auth/login', { email, password });
  return response.data.token;
};

export const register = async (username, email, password) => {
  await httpClient.post('/api/auth/register', { username, email, password });
};

export const fetchRooms = async () => {
  const response = await httpClient.get('/api/rooms');
  return response.data;
};