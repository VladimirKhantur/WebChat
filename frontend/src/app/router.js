import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '../pages/AuthPage.vue';  
import RoomsPage from '../pages/RoomsPage.vue'; 

const routes = [
  { path: '/auth', component: AuthPage },
  { path: '/rooms', component: RoomsPage },
  { path: '/', redirect: '/auth' }, 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;