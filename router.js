import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '../pages/AuthPage.vue';  
import RoomsPage from '../pages/RoomsPage.vue'; 
import ChatPage from '../pages/ChatPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';

const routes = [
  { path: '/auth', component: AuthPage },
  { path: '/rooms', component: RoomsPage },
  { path: '/room/:roomId', component: ChatPage },
  {path: '/profile', component: ProfilePage },
  { path: '/', redirect: '/auth' }, 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;