import { shallowMount } from '@vue/test-utils';
import ProfilePage from '@/pages/ProfilePage.vue';
import { fetchUserData } from '@/shared/api/httpClient';


jest.mock('@/shared/api/httpClient', () => ({
  fetchUserData: jest.fn(),
}));

describe('ProfilePage.vue', () => {
  let wrapper;
  const mockUser = {
    username: 'John Doe',
    email: 'john@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  };

  beforeEach(async () => {

    fetchUserData.mockResolvedValue(mockUser);

    wrapper = shallowMount(ProfilePage, {
      global: {
        mocks: {
          $router: {
            push: jest.fn(),
          },
        },
      },
    });

 
    await wrapper.vm.$nextTick();
  });

  it('отображает имя пользователя', () => {
    expect(wrapper.find('.user-info p:nth-child(1)').text()).toContain(mockUser.username);
  });

  it('отображает email пользователя', () => {
    expect(wrapper.find('.user-info p:nth-child(2)').text()).toContain(mockUser.email);
  });


  it('переходит на страницу чатов при клике на кнопку "Список чатов"', async () => {
    await wrapper.find('.chats-button').trigger('click');
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/rooms');
  });

  it('выходит из системы при клике на кнопку выхода', async () => {
    jest.spyOn(Storage.prototype, 'removeItem');
    await wrapper.find('.logout-button').trigger('click');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/auth');
  });
});