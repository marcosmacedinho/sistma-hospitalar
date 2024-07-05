import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/login.vue';
import Atendimento from '../components/atendimento.vue';  // Verifique o caminho e a capitalização aqui
import Register from '../components/register.vue';
import VisualizarAtendimentos from '../components/visualizarAtendimentos.vue';

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
