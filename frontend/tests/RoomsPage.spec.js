import { shallowMount } from '@vue/test-utils';
import RoomsPage from '@/pages/RoomsPage.vue';

describe('RoomsPage.vue', () => {
  let wrapper;

  const mockRooms = [
    { id: 1, name: 'Room 1' },
    { id: 2, name: 'Room 2' },
    { id: 3, name: 'Room 3' },
    { id: 4, name: 'Room 4' }, // Добавим четвертую комнату для теста
  ];

  beforeEach(() => {
    wrapper = shallowMount(RoomsPage, {
      data() {
        return {
          rooms: mockRooms,
          newRoomName: '',
          errorMessage: '',
          successMessage: '',
          showAddRoomModal: false,
        };
      },
    });
  });

  it('отображает список комнат', () => {
    const roomItems = wrapper.findAll('.list-group-item');
    expect(roomItems.length).toBe(mockRooms.length);
    expect(roomItems.at(0).text()).toContain('Room 1');
    expect(roomItems.at(1).text()).toContain('Room 2');
    expect(roomItems.at(2).text()).toContain('Room 3');
    expect(roomItems.at(3).text()).toContain('Room 4');
  });

  it('отображает сообщение об отсутствии комнат', async () => {
    await wrapper.setData({ rooms: [] });
    expect(wrapper.find('p').text()).toContain('No rooms available.');
  });

  it('открывает модальное окно для создания комнаты', async () => {
    await wrapper.find('.btn-primary').trigger('click');
    expect(wrapper.vm.showAddRoomModal).toBe(true);
  });

it('создает новую комнату', async () => {
  // Мокаем fetch для имитации успешного ответа сервера
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 5, name: 'New Room' }),
    })
  );

  // Открываем модальное окно и устанавливаем название новой комнаты
  await wrapper.setData({ newRoomName: 'New Room', showAddRoomModal: true });

  // Имитируем отправку формы
  await wrapper.find('form').trigger('submit.prevent');

  // Ожидаем обновления состояния
  await wrapper.vm.$nextTick();

  // Проверяем, что fetch был вызван с правильными аргументами
  expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/chat/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'New Room',
      userId: 1,
    }),
  });

  // Проверяем, что количество комнат увеличилось
  const expectedLength = mockRooms.length + 1; // Учитываем изначальное количество комнат
  expect(wrapper.vm.rooms.length).toBe(expectedLength);

  // Проверяем, что новая комната добавлена в список
  const newRoom = wrapper.vm.rooms.find((room) => room.name === 'New Room');
  expect(newRoom).toBeDefined();
  expect(newRoom.name).toBe('New Room');

  // Проверяем, что модальное окно закрылось
  expect(wrapper.vm.showAddRoomModal).toBe(false);

  // Проверяем, что поле для ввода названия комнаты очистилось
  expect(wrapper.vm.newRoomName).toBe('');
});

it('удаляет комнату', async () => {
  // Мокаем fetch для имитации успешного ответа сервера
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
    })
  );

  // Имитируем удаление первой комнаты
  const roomToDelete = mockRooms[0];
  await wrapper.findAll('.btn-danger').at(0).trigger('click'); // Убедитесь, что клик происходит на правильной кнопке

  // Ожидаем обновления состояния
  await wrapper.vm.$nextTick();

  // Проверяем, что fetch был вызван с правильным URL
  expect(global.fetch).toHaveBeenCalledWith(`http://localhost:3000/api/chat/rooms/${roomToDelete.id}`, {
    method: 'DELETE',
  });

  // Проверяем, что комната удалена из списка
  expect(wrapper.vm.rooms.length).toBe(mockRooms.length - 1);
  expect(wrapper.vm.rooms.find((room) => room.id === roomToDelete.id)).toBeUndefined();
});

  it('переходит в комнату при клике на нее', async () => {
    const mockRouterPush = jest.fn();
    wrapper.vm.$router = { push: mockRouterPush };

    // Имитируем клик на первой комнате
    await wrapper.find('.list-group-item').trigger('click');

    // Проверяем, что переход произошел с правильным roomId
    expect(mockRouterPush).toHaveBeenCalledWith('/room/1');
  });

  it('выходит из аккаунта', async () => {
    const mockRouterPush = jest.fn();
    wrapper.vm.$router = { push: mockRouterPush };
    jest.spyOn(Storage.prototype, 'removeItem');

    // Имитируем клик на кнопке выхода
    await wrapper.find('.btn-secondary').trigger('click');

    // Проверяем, что токен удален и произошел переход на страницу авторизации
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockRouterPush).toHaveBeenCalledWith('/auth');
  });
});