<template>
    <div>
      <h2>Room: {{ roomId }}</h2>
  
      <!-- Список сообщений -->
      <div class="chat-window">
        <div v-for="message in messages" :key="message.id" class="message">
          <strong>{{ message.user }}:</strong> {{ message.text }}
        </div>
      </div>
  
      <!-- Форма для отправки сообщений -->
      <form @submit.prevent="sendMessage" class="message-form">
        <input v-model="messageText" placeholder="Type your message..." />
        <button type="submit">Send</button>
      </form>
  
      <!-- Кнопка выхода -->
      <button @click="leaveRoom">Leave Room</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        roomId: this.$route.params.roomId, // Идентификатор комнаты
        messages: [
          { id: 1, user: 'Alice', text: 'Hello!' },
          { id: 2, user: 'Bob', text: 'Hi there!' },
        ], // Фиктивные сообщения
        messageText: '', // Текст нового сообщения
      };
    },
    methods: {
      sendMessage() {
        if (!this.messageText.trim()) return;
  
        const newMessage = {
          id: this.messages.length + 1,
          user: 'You',
          text: this.messageText,
        };
  
        this.messages.push(newMessage); // Добавление нового сообщения
        this.messageText = ''; // Очистка поля ввода
      },
      leaveRoom() {
        this.$router.push('/rooms'); // Перенаправление назад
      },
    },
  };
  </script>
  
  <style>
  .chat-window {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .message {
    margin-bottom: 5px;
  }
  
  .message-form {
    display: flex;
    gap: 5px;
  }
  </style>
  