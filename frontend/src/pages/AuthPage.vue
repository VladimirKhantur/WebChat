<template>
  <div>
    <h2>{{ isLoginMode ? 'Login' : 'Register' }}</h2>

    <!-- Форма для входа/регистрации -->
    <form @submit.prevent="handleSubmit">
      <input v-if="!isLoginMode" v-model="username" placeholder="Username" />
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">{{ isLoginMode ? 'Login' : 'Register' }}</button>
    </form>

    <!-- Переключатель между входом и регистрацией -->
    <p>
      {{ isLoginMode ? "Don't have an account?" : 'Already have an account?' }}
      <button @click="toggleMode">
        {{ isLoginMode ? 'Register' : 'Login' }}
      </button>
    </p>

    <!-- Отображение ошибок -->
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { login, register } from '../shared/api/httpClient'; 

export default {
  data() {
    return {
      isLoginMode: true, 
      username: '',       
      email: '',          
      password: '',      
      errorMessage: '',   
    };
  },
  methods: {
    // Переключение между режимами входа и регистрации
    toggleMode() {
      this.isLoginMode = !this.isLoginMode;
      this.errorMessage = ''; 
    },

    // Обработка отправки формы
    async handleSubmit() {
      if (!this.email || !this.password || (!this.isLoginMode && !this.username)) {
        this.errorMessage = 'Please fill in all fields.';
        return;
      }

      try {
        if (this.isLoginMode) {
          // Вход
          const token = await login(this.email, this.password);
          localStorage.setItem('token', token);
        } else {
          // Регистрация
          await register(this.username, this.email, this.password);
        }
        // Перенаправление на страницу комнат
        this.$router.push('/rooms');
      } catch (error) {
        this.errorMessage = this.isLoginMode
          ? 'Login failed. Please check your credentials.'
          : 'Registration failed. Please try again.';
      }
    },
  },
};
</script>