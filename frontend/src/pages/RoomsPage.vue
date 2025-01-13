<template>
  <div>
    <h2>Rooms</h2>

    <!-- Список комнат -->
    <ul>
      <li
        v-for="room in rooms"
        :key="room.id"
        @click="joinRoom(room.id)"
      >
        {{ room.name }}
      </li>
    </ul>

    <!-- Кнопка выхода -->
    <button @click="logout">Logout</button>

    <!-- Переход в профиль -->
    <button @click="$router.push('/profile')">Profile</button>

    <!-- Сообщение, если комнат нет -->
    <p v-if="rooms.length === 0">No rooms available.</p>

    <!-- Форма для добавления комнаты -->
    <form @submit.prevent="createRoom" class="create-room-form">
      <input v-model="newRoomName" placeholder="New room name" />
      <button type="submit">Add Room</button>
    </form>

    <!-- Ошибки -->
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rooms: [],           // Список комнат
      newRoomName: '',     // Название новой комнаты
      errorMessage: '',    // Сообщения об ошибках
      successMessage: '',  // Сообщения об успехе
    };
  },
  async created() {
    await this.loadRooms(); // Загружаем список комнат при загрузке компонента
  },
  methods: {
    // Загрузка списка комнат с сервера
    async loadRooms() {
      try {
        const response = await fetch('http://localhost:3000/api/chat/rooms');
        if (!response.ok) throw new Error('Failed to load rooms.');
        const data = await response.json();
        this.rooms = data;
      } catch (err) {
        this.errorMessage = err.message;
      }
    },

    // Выход из аккаунта
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/auth');
    },

    // Переход в выбранную комнату
    joinRoom(roomId) {
      this.$router.push(`/room/${roomId}`);
    },

    // Создание новой комнаты
    async createRoom() {
      if (!this.newRoomName.trim()) {
        this.errorMessage = 'Room name cannot be empty.';
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/chat/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.newRoomName,
            userId: 1, // Замените на реальный ID пользователя
          }),
        });

        if (!response.ok) throw new Error('Failed to create room.');
        const newRoom = await response.json();

        this.rooms.push(newRoom); // Добавление новой комнаты в список
        this.newRoomName = '';    // Очистка поля ввода
        this.successMessage = 'Room created successfully!';
        this.errorMessage = '';   // Очистка сообщений об ошибке
      } catch (err) {
        this.errorMessage = err.message;
        this.successMessage = ''; // Очистка сообщений об успехе
      }
    },
  },
};
</script>

<style>
.create-room-form {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}
</style>
