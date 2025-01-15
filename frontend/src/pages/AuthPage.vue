<template>
  <div class="container-fluid vh-100 d-flex align-items-center justify-content-center" style="background-color: rgba(212, 212, 212, 1);">
    <div class="row w-100 justify-content-center">
      <div class="col-md-8 col-lg-6"> 
        <div class="card p-4"> 
          <div class="card-header">
            <h2 class="text-center">{{ isLoginMode ? 'Вход' : 'Регистрация' }}</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              
              <div v-if="!isLoginMode" class="mb-3">
                <label for="username" class="form-label">Имя пользователя</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  placeholder="Введите имя пользователя"
                  v-model="username"
                />
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="Введите email"
                  v-model="email"
                />
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="Введите пароль"
                  v-model="password"
                />
              </div>
              
              <button type="submit" class="btn btn-custom w-100">
                {{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}
              </button>
            </form>

            
            <p class="text-center mt-3">
              {{ isLoginMode ? "Нет аккаунта?" : 'Уже есть аккаунт?' }}
              <button @click="toggleMode" class="btn btn-link">
                {{ isLoginMode ? 'Зарегистрироваться' : 'Войти' }}
              </button>
            </p>

           
            <p v-if="errorMessage" class="text-danger text-center">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </div>
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
        this.errorMessage = 'Пожалуйста, заполните все поля.';
        return;
      }

      try {
        if (this.isLoginMode) {
          await login(this.email, this.password);
        } else {
          await register(this.username, this.email, this.password);
        }
        this.$router.push('/rooms');
      } catch (error) {
        this.errorMessage = this.isLoginMode
          ? 'Ошибка входа. Проверьте данные.'
          : 'Ошибка регистрации. Попробуйте снова.';
      }
    },
  },
};
</script>

