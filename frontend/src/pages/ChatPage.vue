<template>
  <div class="chat-container">
    <h2>Комната: {{ roomId }}</h2>

    <div class="chat-window">
      <div v-for="message in messages" :key="message.id" class="message">
        <strong>{{ message.sender }}:</strong> {{ message.message }}
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="message-form">
      <input v-model="messageText" placeholder="Введите ваше сообщение..." class="form-control" />
      <button type="submit" class="btn-custom">Отправить</button>
    </form>

    <button @click="leaveRoom" class="btn-custom">Покинуть комнату</button>
  </div>
</template>

<script>
import socket from "../socket"; // Относительный путь к файлу socket.js

export default {
  data() {
    return {
      roomId: this.$route.params.roomId, // ID комнаты из URL
      userId: 1, // Пример ID пользователя, заменить на реальный
      username: "User1", // Пример имени пользователя, заменить на реальный
      messages: [], // Сообщения в комнате
      messageText: "", // Текст нового сообщения
    };
  },
  mounted() {
    // Присоединяемся к комнате при загрузке компонента
    socket.emit("joinRoom", { roomId: this.roomId, username: this.username });

    // Загружаем историю сообщений
    socket.on("loadMessages", (messages) => {
      this.messages = messages;
    });

    // Получаем новые сообщения в реальном времени
    socket.on("newMessage", (message) => {
      this.messages.push(message);
    });
  },
  methods: {
    // Отправка сообщения
    sendMessage() {
      if (!this.messageText.trim()) return;

      socket.emit("sendMessage", {
        roomId: this.roomId,
        userId: this.userId,
        message: this.messageText,
      });

      this.messageText = ""; // Очистка поля ввода
    },

    // Выход из комнаты
    leaveRoom() {
      socket.emit("leaveRoom", { roomId: this.roomId, username: this.username });
      this.$router.push("/rooms"); // Возврат на страницу списка комнат
    },
  },
};
</script>

