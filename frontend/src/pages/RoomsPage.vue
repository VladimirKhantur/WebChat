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

    <!-- Сообщение, если комнат нет -->
    <p v-if="rooms.length === 0">No rooms available.</p>
  </div>
</template>

<script>
import { fetchRooms } from '../shared/api/httpClient';

export default {
  data() {
    return {
      rooms: [], // Список комнат
    };
  },
  async created() {
    // Загрузка комнат при создании компонента
    this.rooms = await fetchRooms();
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
  },
};
</script>