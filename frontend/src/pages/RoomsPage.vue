<template>
  <div class="container-fluid vh-100" style="background-color: rgba(212, 212, 212, 1);">
    <div class="row h-100">
      <div class="col-3 bg-light p-3">
        <h2 class="mb-4">Комнаты WebChat</h2>
        <ul class="list-group">
          <li
            v-for="room in rooms"
            :key="room.id"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            @click="joinRoom(room.id)"
          >
            {{ room.name }}
            <button
              class="btn btn-sm btn-danger"
              @click.stop="deleteRoom(room.id)"
            >
              &times;
            </button>
          </li>
        </ul>

        <button
          class="btn btn-primary mt-3 w-100"
          @click="showAddRoomModal = true"
        >
          <i class="bi bi-plus-lg"></i> Добавить комнату
        </button>
      </div>

   
      <div class="col-9 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3>Добро пожаловать в WebChat!</h3>
          <div>
            <button @click="logout" class="btn btn-secondary me-2">Logout</button>
            <button @click="$router.push('/profile')" class="btn btn-info">Profile</button>
          </div>
        </div>

      
        <p v-if="rooms.length === 0" class="text-center">No rooms available.</p>
      </div>
    </div>

    <div v-if="showAddRoomModal" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Добавить комнату</h5>
          <button type="button" class="btn-close" @click="showAddRoomModal = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createRoom">
            <div class="mb-3">
              <label for="newRoomName" class="form-label">Название комнаты</label>
              <input
                v-model="newRoomName"
                type="text"
                class="form-control"
                id="newRoomName"
                placeholder="Введите название комнаты"
              />
            </div>
            <button type="submit" class="btn btn-primary">Создать</button>
          </form>
        </div>
      </div>
    </div>

  
    <div v-if="errorMessage" class="alert alert-danger fixed-top m-3">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="alert alert-success fixed-top m-3">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rooms: [],          
      newRoomName: '',     
      errorMessage: '',    
      successMessage: '', 
      showAddRoomModal: false, 
    };
  },
  async created() {
    await this.loadRooms(); 
  },
  methods: {
    
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
        this.errorMessage = 'Название комнаты не может быть пустым.';
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

        if (!response.ok) throw new Error('Не удалось создать комнату.');
        const newRoom = await response.json();

        this.rooms.push(newRoom); // Добавление новой комнаты в список
        this.newRoomName = '';    // Очистка поля ввода
        this.successMessage = 'Комната успешно создана!';
        this.errorMessage = '';   // Очистка сообщений об ошибке
        this.showAddRoomModal = false; // Закрытие модального окна
      } catch (err) {
        this.errorMessage = err.message;
        this.successMessage = ''; // Очистка сообщений об успехе
      }
    },

    // Удаление комнаты
    async deleteRoom(roomId) {
      try {
        const response = await fetch(`http://localhost:3000/api/chat/rooms/${roomId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Не удалось удалить комнату.');
        this.rooms = this.rooms.filter((room) => room.id !== roomId);
        this.successMessage = 'Комната успешно удалена!';
        this.errorMessage = ''; // Очистка сообщений об ошибке
      } catch (err) {
        this.errorMessage = err.message;
      }
    },
  },
};
</script>

