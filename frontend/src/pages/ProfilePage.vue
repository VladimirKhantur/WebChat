<template>
  <div class="profile-container">
    <div class="profile-content">
      <!-- Аватар пользователя -->
      <div class="avatar-section">
        <div class="avatar">
          <img :src="user.avatarUrl || 'https://img.icons8.com/?size=100&id=23242&format=png&color=000000'" alt="Avatar" />
        </div>
        <!-- Кнопка выхода -->
        <button @click="logout" class="logout-button">Выйти</button>
      </div>

      <!-- Информация о пользователе -->
      <div class="user-info-section">
        <h2>Профиль</h2>
        <div class="user-info">
          <p><strong>Имя:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Дата регистрации:</strong> {{ formatDate(user.createdAt) }}</p>
        </div>

        <!-- Список чатов -->
        <div class="user-rooms">
          <h3>Чаты</h3>
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
      </div>
    </div>
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
      return new Date(date).toLocaleDateString('ru-RU', options);
    },
  },
};
</script>

