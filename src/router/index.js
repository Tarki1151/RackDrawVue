import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../components/WelcomePage.vue';
import MainApp from '../components/MainApp.vue';

const routes = [
  { path: '/', component: WelcomePage },
  { path: '/app', component: MainApp }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;