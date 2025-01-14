<template>
  <div class="chat-container">
    <h2>Комната: {{ roomId }}</h2>

    <div class="chat-window" ref="chatWindow">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message', { 'my-message': message.userId === userId }]"
      >
        <p>
          <strong>{{ message.sender }}</strong>
          <span class="timestamp">({{ formatTime(message.timestamp) }})</span>:
        </p>
        <p>{{ message.message }}</p>
      </div>
      <div ref="messageEnd"></div> 
    </div>

    <form @submit.prevent="sendMessage" class="message-form">
      <input
        v-model="messageText"
        placeholder="Введите ваше сообщение..."
        class="form-control"
      />
      <button type="submit" class="btn">Отправить</button>
    </form>

    <button @click="leaveRoom" class="btn">Покинуть комнату</button>
  </div>
</template>

<script>
import socket from "../socket";

export default {
  data() {
    return {
      roomId: this.$route.params.roomId,
      userId: null,
      username: null,
      messages: [],
      messageText: "",
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    this.userId = user.id;
    this.username = user.username;

    socket.emit("joinRoom", { roomId: this.roomId, username: this.username });

    // Загружаем историю сообщений
    socket.on("loadMessages", (messages) => {
      this.messages = this.mergeMessages(this.messages, messages);
      this.scrollToBottom();
    });

    // Получаем новые сообщения
    socket.on("newMessage", (message) => {
      console.log("Received newMessage:", message); 
      this.messages = this.mergeMessages(this.messages, [message]);
      this.scrollToBottom();
    });
  },
  methods: {
    sendMessage() {
      if (!this.messageText.trim()) return;

      const tempId = `temp-${Date.now()}`; 

      const localMessage = {
        id: tempId, 
        sender: this.username,
        message: this.messageText,
        timestamp: new Date().toISOString(),
        isTemporary: true, 
        userId: this.userId, 
      };

      this.messages.push(localMessage);

      socket.emit("sendMessage", {
        roomId: this.roomId,
        userId: this.userId,
        message: this.messageText,
        tempId,
      });

      this.messageText = ""; 
    },

    leaveRoom() {
      socket.emit("leaveRoom", { roomId: this.roomId, username: this.username });
      this.$router.push("/rooms");
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },

    mergeMessages(currentMessages, newMessages) {
      const uniqueMessages = [...currentMessages];

      newMessages.forEach((newMsg) => {
        if (newMsg.tempId) {
          const tempIndex = uniqueMessages.findIndex(
            (msg) => msg.id === newMsg.tempId
          );
          if (tempIndex !== -1) {
            uniqueMessages.splice(tempIndex, 1, newMsg);
            return;
          }
        }

        if (!uniqueMessages.find((msg) => msg.id === newMsg.id)) {
          uniqueMessages.push(newMsg);
        }
      });

      return uniqueMessages;
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const messageEnd = this.$refs.messageEnd;
        if (messageEnd) {
          messageEnd.scrollIntoView({ behavior: "smooth" });
        }
      });
    },
  },
};
</script>

<style scoped>

.message {
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  background-color: #f9f9f9; 
}

.my-message {
  background-color: #89c3e04c; 
  border-left: 4px solid #007bff; 
}

.message p {
  margin: 0;
}

.timestamp {
  color: #888;
  font-size: 0.8em;
}

.btn {
  padding: 8px 16px;
  margin-left: 8px;
  background-color: #007bff; 
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3; 
}
</style>
