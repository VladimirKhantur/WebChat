import { shallowMount } from '@vue/test-utils';
import RoomsPage from '@/pages/RoomsPage.vue';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

global.localStorage = {
  getItem: jest.fn(() => 'fake-token'),
  removeItem: jest.fn(),
};

describe('RoomsPage.vue', () => {
  let wrapper;

  const mockRooms = [
    { id: 1, name: 'Room 1' },
    { id: 2, name: 'Room 2' },
    { id: 3, name: 'Room 3' },
    { id: 4, name: 'Room 4' },
  ];

  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRooms),
    });

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
      global: {
        mocks: {
          $router: {
            push: jest.fn(),
          },
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('отображает список комнат', () => {
    const roomItems = wrapper.findAll('.list-group-item');
    expect(roomItems.length).toBe(mockRooms.length);

    mockRooms.forEach((room, index) => {
      expect(roomItems.at(index).text()).toContain(room.name);
    });
  });

  it('отображает сообщение об отсутствии комнат', async () => {
    await wrapper.setData({ rooms: [] });
    expect(wrapper.find('p').text()).toContain('No rooms available.');
  });

  it('переходит в комнату при клике на нее', async () => {
    const roomToJoin = mockRooms[0];

    await wrapper.find('.list-group-item').trigger('click');

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith(`/room/${roomToJoin.id}`);
  });

  it('отображает сообщение об ошибке при неудачном удалении комнаты', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Server Error',
    });

    await wrapper.findAll('.btn-danger').at(0).trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.errorMessage).toBe('Не удалось удалить комнату.');
  });
  
  
});
