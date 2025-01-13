<template>
    <div class="profile">
      <h2>Profile</h2>
  
      <!-- Аватар пользователя -->
      <div class="avatar">
        <img :src="user.avatarUrl" alt="Avatar" />
      </div>
  
      <!-- Информация о пользователе -->
      <div class="user-info">
        <p><strong>Name:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
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
  export default {
    data() {
      return {
        // Статические данные пользователя для тестирования
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatarUrl: 'https://via.placeholder.com/150', // Заглушка аватарки
          rooms: [
            { id: 1, name: 'General Chat' },
            { id: 2, name: 'Sports Chat' },
          ],
        },
      };
    },
    methods: {
      goToRoom(roomId) {
        this.$router.push(`/room/${roomId}`);
      },
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/auth');
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
    width: 150px;
    height: 150px;
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
  