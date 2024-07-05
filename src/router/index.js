import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Atendimento from '../views/Atendimento.vue';
import Register from '../views/Register.vue';
import VisualizarAtendimentos from '../views/visualizarAtendimentos.vue';

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
