import { shallowMount } from '@vue/test-utils';
import ProfilePage from '@/pages/ProfilePage.vue';

describe('ProfilePage.vue', () => {
  let wrapper;
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://example.com/avatar.jpg',
    rooms: [{ id: 1, name: 'Room 1' }, { id: 2, name: 'Room 2' }],
    createdAt: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    wrapper = shallowMount(ProfilePage, {
      data() {
        return {
          user: mockUser,
        };
      },
    });
  });

  it('отображает имя пользователя', () => {
    expect(wrapper.find('.user-info p:nth-child(1)').text()).toContain(mockUser.name);
  });

  it('отображает email пользователя', () => {
    expect(wrapper.find('.user-info p:nth-child(2)').text()).toContain(mockUser.email);
  });

  it('отображает дату регистрации в правильном формате', () => {
    const formattedDate = new Date(mockUser.createdAt).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(wrapper.find('.user-info p:nth-child(3)').text()).toContain(formattedDate);
  });

  it('отображает список чатов', () => {
    const rooms = wrapper.findAll('.user-rooms li');
    expect(rooms.length).toBe(mockUser.rooms.length);
    mockUser.rooms.forEach((room, index) => {
      expect(rooms.at(index).text()).toBe(room.name);
    });
  });

  it('переходит в чат при клике на элемент списка', async () => {
    const mockRouterPush = jest.fn();
    wrapper.vm.$router = { push: mockRouterPush };

    await wrapper.find('.user-rooms li').trigger('click');
    expect(mockRouterPush).toHaveBeenCalledWith('/room/1');
  });

  it('выходит из системы при клике на кнопку выхода', async () => {
    const mockRouterPush = jest.fn();
    wrapper.vm.$router = { push: mockRouterPush };
    jest.spyOn(Storage.prototype, 'removeItem');

    await wrapper.find('.logout-button').trigger('click');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockRouterPush).toHaveBeenCalledWith('/auth');
  });
});