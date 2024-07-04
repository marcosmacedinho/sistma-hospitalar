import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/login.vue';
import Register from '../components/Register.vue';
import Atendimento from '../components/Atendimento.vue';
import VisualizarAtendimentos from '../components/VisualizarAtendimentos.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/atendimento', component: Atendimento },
  { path: '/visualizar-atendimentos', component: VisualizarAtendimentos },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
