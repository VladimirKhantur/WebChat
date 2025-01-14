import { shallowMount } from '@vue/test-utils';
import RoomsPage from '@/pages/RoomsPage.vue';

describe('RoomsPage.vue', () => {
  let wrapper;

  const mockRooms = [
    { id: 1, name: 'Room 1' },
    { id: 2, name: 'Room 2' },
    { id: 3, name: 'Room 3' },
    { id: 4, name: 'Room 4' }, 
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

it('удаляет комнату', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
    })
  );
  const roomToDelete = mockRooms[0];
  await wrapper.findAll('.btn-danger').at(0).trigger('click'); // Убедитесь, что клик происходит на правильной кнопке

  await wrapper.vm.$nextTick();

  expect(global.fetch).toHaveBeenCalledWith(`http://localhost:3000/api/chat/rooms/${roomToDelete.id}`, {
    method: 'DELETE',
  });

  expect(wrapper.vm.rooms.length).toBe(mockRooms.length - 1);
  expect(wrapper.vm.rooms.find((room) => room.id === roomToDelete.id)).toBeUndefined();
});


  it('переходит в комнату при клике на нее', async () => {
    const mockRouterPush = jest.fn();
    wrapper.vm.$router = { push: mockRouterPush };
    await wrapper.find('.list-group-item').trigger('click');
    expect(mockRouterPush).toHaveBeenCalledWith('/room/1');
  });
  

  it('выходит из аккаунта', async () => {
    const mockRouterPush = jest.fn();
    wrapper.vm.$router = { push: mockRouterPush };
    jest.spyOn(Storage.prototype, 'removeItem');

    await wrapper.find('.btn-secondary').trigger('click');

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockRouterPush).toHaveBeenCalledWith('/auth');
  });
});