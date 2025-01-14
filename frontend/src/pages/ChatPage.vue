<template>
  <div class="chat-container">
    <h2>Комната: {{ roomId }}</h2>

    <div class="chat-window">
      <div v-for="message in messages" :key="message.id" class="message">
        <p>
          <strong>{{ message.sender }}</strong>
          <span class="timestamp">({{ formatTime(message.timestamp) }})</span>:
        </p>
        <p>{{ message.message }}</p>
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
import socket from "../socket"; // Подключение WebSocket

export default {
  data() {
    return {
      roomId: this.$route.params.roomId, // ID комнаты из URL
      userId: null, // ID текущего пользователя
      username: null, // Имя текущего пользователя
      messages: [], // Список сообщений
      messageText: "", // Текст нового сообщения
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user")); // Получаем данные пользователя из localStorage
    this.userId = user.id;
    this.username = user.username;

    // Присоединяемся к комнате
    socket.emit("joinRoom", { roomId: this.roomId, username: this.username });

    // Загружаем историю сообщений
    socket.on("loadMessages", (messages) => {
      this.messages = messages;
    });

    // Получаем новые сообщения
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
      this.$router.push("/rooms"); // Переход на страницу списка комнат
    },

    // Форматирование времени
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },
  },
};
</script>