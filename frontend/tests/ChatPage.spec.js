import { mount } from '@vue/test-utils';
import ChatPage from '@/pages/ChatPage.vue';
import { createRouter, createWebHistory } from 'vue-router';
import socket from '@/shared/socket';

jest.mock('@/shared/socket', () => ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/rooms', component: { template: '<div>Rooms</div>' } },
    { path: '/chat/:roomId', component: ChatPage },
  ],
});

describe('ChatPage.vue', () => {
  let wrapper;
  let loadMessagesCallback;
  let newMessageCallback;

  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'User1' }));

    socket.on.mockImplementation((event, callback) => {
      if (event === 'loadMessages') {
        loadMessagesCallback = callback;
      }
      if (event === 'newMessage') {
        newMessageCallback = callback;
      }
    });

    await router.push('/chat/123');

    wrapper = mount(ChatPage, {
      global: {
        plugins: [router],
        mocks: {
          socket,
        },
      },
    });

    if (loadMessagesCallback) {
      loadMessagesCallback([
        { id: 1, sender: 'User1', message: 'Привет!', timestamp: new Date() },
        { id: 2, sender: 'User2', message: 'Как дела?', timestamp: new Date() },
      ]);
    }

    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('отображает ID комнаты', () => {
    expect(wrapper.find('h2').text()).toBe('Комната: 123');
  });

  it('добавляет новое сообщение при событии newMessage', async () => {
    if (newMessageCallback) {
      newMessageCallback({
        id: 3,
        sender: 'User3',
        message: 'Новое сообщение',
        timestamp: new Date(),
      });

      await wrapper.vm.$nextTick();

      const messages = wrapper.findAll('.message');
      expect(messages.length).toBe(3);
      expect(messages[2].text()).toContain('User3: Новое сообщение');
    }
  });



  it('скроллит к последнему сообщению при получении нового сообщения', async () => {
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    if (newMessageCallback) {
      newMessageCallback({
        id: 3,
        sender: 'User3',
        message: 'Новое сообщение',
        timestamp: new Date(),
      });

      await wrapper.vm.$nextTick();

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    }
  });

  it('добавляет временное сообщение при отправке', async () => {
    await wrapper.setData({ messageText: 'Тестовое сообщение' });

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');
  
    const messages = wrapper.findAll('.message');
    expect(messages[messages.length - 1].text()).toContain('Тестовое сообщение');
    expect(wrapper.vm.messages[wrapper.vm.messages.length - 1].isTemporary).toBe(true);
  });
  
  
});