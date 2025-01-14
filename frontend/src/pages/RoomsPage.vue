<template>
  <div class="container-fluid min-vh-100">
    <div class="row h-100">
      <!-- Боковая панель (Список чатов) -->
      <div class="col-3 bg-light p-3 d-flex flex-column">
        <h2 class="mb-4">Комнаты WebChat</h2>
        <ul class="list-group flex-grow-1 overflow-auto">
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

      <div class="col-9 p-4 d-flex flex-column">
        <div class="header-section">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>Добро пожаловать в WebChat!</h3>
            <div>
              <button @click="logout" class="btn btn-secondary me-2">Logout</button>
              <button @click="$router.push('/profile')" class="btn btn-info">Profile</button>
            </div>
          </div>
        </div>

        <div class="content-section flex-grow-1 overflow-auto">
          <p v-if="rooms.length === 0" class="text-center">No rooms available.</p>
        </div>
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
        const response = await fetch('http://localhost:3000/api/chat/rooms', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) throw new Error('Не удалось загрузить комнаты.');
        const data = await response.json();
        this.rooms = data;
      } catch (err) {
        this.errorMessage = err.message;
      }
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
      this.$router.push('/auth');
    },

    joinRoom(roomId) {
      this.$router.push(`/room/${roomId}`);
    },

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
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          },
          body: JSON.stringify({
            name: this.newRoomName,
          }),
        });

        if (!response.ok) throw new Error('Не удалось создать комнату.');
        const newRoom = await response.json();

        this.rooms.push(newRoom); 
        this.newRoomName = '';
        this.successMessage = 'Комната успешно создана!';
        this.errorMessage = '';
        this.showAddRoomModal = false;
      } catch (err) {
        this.errorMessage = err.message;
        this.successMessage = '';
      }
    },

    async deleteRoom(roomId) {
      try {
        const response = await fetch(`http://localhost:3000/api/chat/rooms/${roomId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) throw new Error('Не удалось удалить комнату.');
        this.rooms = this.rooms.filter((room) => room.id !== roomId);
        this.successMessage = 'Комната успешно удалена!';
        this.errorMessage = '';
      } catch (err) {
        this.errorMessage = err.message;
      }
    },
  },
};
</script>

<style scoped>
.container-fluid {
  background-color: rgba(212, 212, 212, 1); 
  min-height: 100vh;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
}

.alert {
  z-index: 1000;
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

.chats-button {
  margin-top: 20px;
  padding: 10px 40px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.chats-button:hover {
  background-color: #40a9ff;
}

.user-info-section {
  margin-top: 20px;
}

.user-info p {
  margin: 5px 0;
}

.col-3 {
  max-height: 100vh;
  overflow-y: auto;
}

.col-9 {
  display: flex;
  flex-direction: column;
}

.content-section {
  flex-grow: 1;
  overflow-y: auto;
}

body {
  margin: 0;
  padding: 0;
  background-color: rgba(212, 212, 212, 1);
}


</style>
