<template>
  <div>
    <h2>Room: {{ roomId }}</h2>

    <!-- Список сообщений -->
    <div class="chat-window">
      <div v-for="message in messages" :key="message.id" class="message">
        <strong>{{ message.sender }}:</strong> {{ message.message }}
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
