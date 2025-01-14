import { mount } from '@vue/test-utils';
import AuthPage from '@/pages/AuthPage.vue';
import { login, register } from '@/shared/api/httpClient';

jest.mock('@/shared/api/httpClient', () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

describe('AuthPage.vue', () => {
  let wrapper;

  beforeEach(() => {
    localStorage.clear(); 
    wrapper = mount(AuthPage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('переключается между режимами входа и регистрации', async () => {
    expect(wrapper.vm.isLoginMode).toBe(true);
    expect(wrapper.find('h2').text()).toBe('Вход'); 

    await wrapper.find('button.btn-link').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isLoginMode).toBe(false);
    expect(wrapper.find('h2').text()).toBe('Регистрация'); 
  });

  it('отображает сообщение об ошибке, если поля не заполнены', async () => {
    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick(); // Ожидаем обновления DOM

    expect(wrapper.find('.text-danger').exists()).toBe(true); // Проверяем, что элемент существует
    expect(wrapper.find('.text-danger').text()).toBe('Пожалуйста, заполните все поля.');
  });

  it('вызывает login при отправке формы в режиме входа', async () => {
    await wrapper.setData({
      email: 'test@example.com',
      password: 'password',
    });

    login.mockResolvedValue('fake-token');

    await wrapper.find('form').trigger('submit');
    expect(login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('вызывает register при отправке формы в режиме регистрации', async () => {
    await wrapper.find('button.btn-link').trigger('click');
    await wrapper.setData({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
    });

    register.mockResolvedValue({});

    await wrapper.find('form').trigger('submit');
    expect(register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password');
  });

  it('отображает сообщение об ошибке при неудачном входе', async () => {
    await wrapper.setData({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    login.mockRejectedValue(new Error('Ошибка входа'));

    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick(); // Ожидаем обновления DOM

    expect(wrapper.find('.text-danger').exists()).toBe(true); // Проверяем, что элемент существует
    expect(wrapper.find('.text-danger').text()).toBe('Ошибка входа. Проверьте данные.');
  });

  it('отображает сообщение об ошибке при неудачной регистрации', async () => {
    await wrapper.find('button.btn-link').trigger('click');
    await wrapper.setData({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
    });

    register.mockRejectedValue(new Error('Ошибка регистрации'));

    await wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick(); 

    expect(wrapper.find('.text-danger').exists()).toBe(true); 
    expect(wrapper.find('.text-danger').text()).toBe('Ошибка регистрации. Попробуйте снова.');
  });
});