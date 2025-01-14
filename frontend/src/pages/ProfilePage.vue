<template>
  <div class="profile-container">
    <div class="profile-content">
  
      <div class="avatar-section">
        <div class="avatar">
          <img :src="user.avatarUrl || getRandomAvatar()" alt="Avatar" />
        </div>
        
        <button @click="logout" class="logout-button">Выйти</button>
      </div>

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
      avatars: [
        'https://img.icons8.com/?size=100&id=xuqvSAsgBfzm&format=png&color=000000',
        'https://img.icons8.com/?size=100&id=NdTzukeLs_pM&format=png&color=000000',
        'https://img.icons8.com/?size=100&id=gi2v1v7IEA_D&format=png&color=000000',
        'https://img.icons8.com/?size=100&id=UwAh6su01bil&format=png&color=000000', 
        'https://img.icons8.com/?size=100&id=hopN4KhliyoJ&format=png&color=000000',
        'https://img.icons8.com/?size=100&id=VcTCb_viZ8ui&format=png&color=000000',
        'https://img.icons8.com/?size=100&id=Eb_WjSQOlQGi&format=png&color=000000',
        'https://img.icons8.com/?size=100&id=kzn30CdDS3nH&format=png&color=000000',
        'https://img.icons8.com/?size=100&id=YpfO1uO_dkpP&format=png&color=000000',
        'https://img.icons8.com/?size=100&id=sRKA72rTFhNg&format=png&color=000000',
      ],
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
    // Метод для случайного выбора аватарки
    getRandomAvatar() {
      const randomIndex = Math.floor(Math.random() * this.avatars.length);
      return this.avatars[randomIndex];
    },
  },
};
</script>