<template>
  <div class="profile-container">
    <div class="profile-content">

      <div class="avatar-section">
        <div class="avatar">
          <img :src="avatar" alt="Аватар" />
        </div>
        
        <button @click="logout" class="logout-button">Выйти</button>
      </div>

      <div class="user-info-section">
        <h2>Профиль</h2>
        <div class="user-info">
          <p><strong>Логин:</strong> {{ user.username }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
        <button @click="goToChats" class="chats-button">Список чатов</button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUserData } from '../shared/api/httpClient'; // Импорт функции API

export default {
  data() {
    return {
      user: {
        username: '',
        email: '',
        createdAt: '', // Добавляем createdAt в объект пользователя (можно удалить, если не используется)
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
      avatar: '', // Добавляем поле для аватарки
    };
  },
  async created() {
    try {
      // Загружаем данные пользователя
      const userData = await fetchUserData();
      this.user = userData;
      this.avatar = this.getRandomAvatar(); // Выбираем аватар после загрузки данных
    } catch (error) {
      console.error('Не удалось загрузить данные пользователя:', error);
      // Перенаправляем на страницу авторизации, если произошла ошибка
      this.$router.push('/auth');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Убираем сохранённые данные пользователя, если они есть
      this.$router.push('/auth');
    },
    goToChats() {
      this.$router.push('/rooms'); // Переход к списку чатов
    },
    // Форматируем дату регистрации (можно удалить, если не используется)
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

<style scoped>
.profile-container {
  background-color: #e9ecef; 
}

.avatar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

.logout-button {
  padding: 10px 40px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #ff7875;
}

.user-info-section {
  margin-top: 20px;
}

.user-info p {
  margin: 5px 0;
}
</style>
