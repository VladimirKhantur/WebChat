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

    <!--Переход в профиль-->
    <button @click="$router.push('/profile')">Profile</button>

    <!-- Сообщение, если комнат нет -->
    <p v-if="rooms.length === 0">No rooms available.</p>

    <!-- Форма для добавления комнаты -->
    <form @submit.prevent="createRoom" class="create-room-form">
      <input v-model="newRoomName" placeholder="New room name" />
      <button type="submit">Add Room</button>
    </form>

    <!-- Ошибки создания комнаты -->
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rooms: [
        { id: 1, name: 'General Chat' }, // Тестовая комната
      ],          // Список комнат
      newRoomName: '',    // Название новой комнаты
      errorMessage: '',   // Сообщения об ошибках
    };
  },
  methods: {
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
    createRoom() {
      if (!this.newRoomName.trim()) {
        this.errorMessage = 'Room name cannot be empty.';
        return;
      }

      const newRoom = { id: this.rooms.length + 1, name: this.newRoomName };
      this.rooms.push(newRoom); // Добавление новой комнаты в список
      this.newRoomName = '';    // Очистка поля ввода
      this.errorMessage = '';   // Сброс ошибок
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
