import { mount } from '@vue/test-utils';
import ChatPage from '@/pages/ChatPage.vue';
import { createRouter, createWebHistory } from 'vue-router';
import socket from '@/shared/socket'; // Explicitly import the mock

jest.mock('@/shared/socket', () => ({
  emit: jest.fn(),
  on: jest.fn((event, callback) => {
    if (event === 'loadMessages') {
      callback([
        { id: 1, sender: 'User1', message: 'Привет!' },
        { id: 2, sender: 'User2', message: 'Как дела?' },
      ]);
    }
    if (event === 'newMessage') {
      callback({ id: 3, sender: 'User3', message: 'Новое сообщение' });
    }
  }),
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

  beforeEach(async () => {
    await router.push('/chat/123');
    wrapper = mount(ChatPage, {
      global: {
        plugins: [router],
      },
    });

    const loadMessagesCallback = socket.on.mock.calls.find(([event]) => event === 'loadMessages')[1];
    loadMessagesCallback([
      { id: 1, sender: 'User1', message: 'Привет!' },
      { id: 2, sender: 'User2', message: 'Как дела?' },
    ]);

    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('отображает ID комнаты', () => {
    expect(wrapper.find('h2').text()).toBe('Комната: 123');
  });

  it('отображает сообщения в чате', async () => {
    const messages = wrapper.findAll('.message');
    expect(messages.length).toBe(2);
    expect(messages[0].text()).toContain('User1: Привет!');
    expect(messages[1].text()).toContain('User2: Как дела?');
  });

  it('отправляет сообщение при отправке формы', async () => {
    await wrapper.find('input').setValue('Новое сообщение');
    await wrapper.find('form').trigger('submit');
    expect(socket.emit).toHaveBeenCalledWith('sendMessage', {
      roomId: '123',
      userId: 1,
      message: 'Новое сообщение',
    });
    expect(wrapper.vm.messageText).toBe('');
  });

  it('добавляет новое сообщение при событии newMessage', async () => {
    const newMessageCallback = socket.on.mock.calls.find(([event]) => event === 'newMessage')[1];
    newMessageCallback({
      id: 3,
      sender: 'User3',
      message: 'Новое сообщение',
    });

    await wrapper.vm.$nextTick();

    const messages = wrapper.findAll('.message');
    expect(messages.length).toBe(3);
    expect(messages[2].text()).toContain('User3: Новое сообщение');
  });

  it('покидает комнату при нажатии на кнопку "Покинуть комнату"', async () => {
    await wrapper.find('.btn-custom:last-child').trigger('click');
    expect(socket.emit).toHaveBeenCalledWith('leaveRoom', {
      roomId: '123',
      username: 'User1',
    });
    expect(router.currentRoute.value.path).toBe('/rooms');
  });
});
