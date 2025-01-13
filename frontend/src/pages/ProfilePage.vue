<template>
  <div class="profile">
    <h2>Profile</h2>

    <!-- Аватар пользователя -->
    <div class="avatar">
      <img :src="user.avatarUrl || 'https://img.icons8.com/?size=100&id=23242&format=png&color=000000'" alt="Avatar" />
    </div>

    <!-- Информация о пользователе -->
    <div class="user-info">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <!-- Дата регистрации -->
      <p><strong>Registered on:</strong> {{ formatDate(user.createdAt) }}</p>
    </div>

    <!-- Список чатов -->
    <div class="user-rooms">
      <h3>Chats</h3>
      <ul>
        <li
          v-for="room in user.rooms"
          :key="room.id"
          @click="goToRoom(room.id)"
        >
          {{ room.name }}
        </li>
      </ul>
    </div>

    <!-- Кнопка выхода -->
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { fetchUserData } from '../shared/api/httpClient'; // Импорт API-функции

export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        avatarUrl: '',
        rooms: [],
        createdAt: '', // Добавляем createdAt в объект пользователя
      },
    };
  },
  async created() {
    try {
      // Загружаем данные пользователя
      const userData = await fetchUserData();
      this.user = userData;
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },
  methods: {
    goToRoom(roomId) {
      this.$router.push(`/room/${roomId}`);
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/auth');
    },
    // Форматируем дату регистрации
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
  },
};
</script>

<style>
.profile {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.avatar img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.user-info p {
  margin: 5px 0;
}

.user-rooms ul {
  list-style: none;
  padding: 0;
}

.user-rooms li {
  cursor: pointer;
  color: blue;
  text-decoration: underline;
}
</style>
