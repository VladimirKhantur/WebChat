import { httpClient, login, register, fetchRooms, fetchMessages, sendMessageToRoom, createRoom, fetchUserData } from '@/shared/api/httpClient';

beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn(() => 'fake-token'),
  };
jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('login', () => {
  it('должен возвращать токен при успешном входе', async () => {
    const mockToken = 'fake-token';
    jest.spyOn(httpClient, 'post').mockResolvedValue({ data: { token: mockToken } });

    const token = await login('test@example.com', 'password');
    expect(token).toBe(mockToken);
    expect(httpClient.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('должен выбрасывать ошибку при неудачном входе', async () => {
    jest.spyOn(httpClient, 'post').mockRejectedValue(new Error('Ошибка входа'));

    await expect(login('wrong@example.com', 'wrongpassword')).rejects.toThrow('Ошибка входа');
  });
});

describe('register', () => {
  it('должен успешно регистрировать пользователя', async () => {
    jest.spyOn(httpClient, 'post').mockResolvedValue({});

    await register('testuser', 'test@example.com', 'password');
    expect(httpClient.post).toHaveBeenCalledWith('/api/auth/register', {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('должен выбрасывать ошибку при неудачной регистрации', async () => {
    jest.spyOn(httpClient, 'post').mockRejectedValue(new Error('Ошибка регистрации'));

    await expect(register('testuser', 'test@example.com', 'password')).rejects.toThrow(
      'Ошибка регистрации',
    );
  });
});

describe('fetchRooms', () => {
  it('должен возвращать список комнат', async () => {
    const mockRooms = [{ id: 1, name: 'Room 1' }];
    jest.spyOn(httpClient, 'get').mockResolvedValue({ data: mockRooms });

    const rooms = await fetchRooms();
    expect(rooms).toEqual(mockRooms);
    expect(httpClient.get).toHaveBeenCalledWith('/api/rooms');
  });

  it('должен выбрасывать ошибку при неудачном запросе', async () => {
    jest.spyOn(httpClient, 'get').mockRejectedValue(new Error('Ошибка загрузки комнат'));

    await expect(fetchRooms()).rejects.toThrow('Ошибка загрузки комнат');
  });
});

describe('fetchMessages', () => {
  it('должен возвращать сообщения для комнаты', async () => {
    const mockMessages = [{ id: 1, text: 'Привет!' }];
    jest.spyOn(httpClient, 'get').mockResolvedValue({ data: mockMessages });

    const messages = await fetchMessages(1);
    expect(messages).toEqual(mockMessages);
    expect(httpClient.get).toHaveBeenCalledWith('/api/rooms/1/messages');
  });

  it('должен выбрасывать ошибку при неудачном запросе', async () => {
    jest.spyOn(httpClient, 'get').mockRejectedValue(new Error('Ошибка загрузки сообщений'));

    await expect(fetchMessages(1)).rejects.toThrow('Ошибка загрузки сообщений');
  });
});

describe('sendMessageToRoom', () => {
  it('должен успешно отправлять сообщение', async () => {
    jest.spyOn(httpClient, 'post').mockResolvedValue({});

    await sendMessageToRoom(1, 'Новое сообщение');
    expect(httpClient.post).toHaveBeenCalledWith('/api/rooms/1/messages', {
      text: 'Новое сообщение',
    });
  });

  it('должен выбрасывать ошибку при неудачной отправке', async () => {
    jest.spyOn(httpClient, 'post').mockRejectedValue(new Error('Ошибка отправки сообщения'));

    await expect(sendMessageToRoom(1, 'Новое сообщение')).rejects.toThrow(
      'Ошибка отправки сообщения',
    );
  });
});

describe('createRoom', () => {
  it('должен успешно создавать комнату', async () => {
    const mockRoom = { id: 1, name: 'Новая комната' };
    jest.spyOn(httpClient, 'post').mockResolvedValue({ data: mockRoom });

    const room = await createRoom('Новая комната');
    expect(room).toEqual(mockRoom);
    expect(httpClient.post).toHaveBeenCalledWith('/api/rooms', {
      name: 'Новая комната',
    });
  });

  it('должен выбрасывать ошибку при неудачном создании', async () => {
    jest.spyOn(httpClient, 'post').mockRejectedValue(new Error('Ошибка создания комнаты'));

    await expect(createRoom('Новая комната')).rejects.toThrow('Ошибка создания комнаты');
  });
});