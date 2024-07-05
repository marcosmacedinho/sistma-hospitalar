import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Atendimento from '../components/Atendimento.vue';  // Verifique o caminho e a capitalização aqui
import Register from '../components/Register.vue';
import VisualizarAtendimentos from '../components/VisualizarAtendimentos.vue';

const routes = [
  { path: '/', redirect: '/Login' },
  { path: '/Login', component: Login },
  { path: '/Register', component: Register },
  { path: '/Atendimento', component: Atendimento },
  { path: '/Visualizar-atendimentos', component: VisualizarAtendimentos },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
