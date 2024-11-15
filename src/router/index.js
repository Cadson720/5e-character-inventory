import { createRouter, createWebHistory } from 'vue-router';
import RacePage from '@/pages/RacePage.vue';
import ClassPage from '@/pages/ClassPage.vue';
import BackgroundPage from '@/pages/BackgroundPage.vue';

const routes = [
  {
    path: '/',
    name: 'RacePage',
    component: RacePage,
  },
  {
    path: '/class',
    name: 'ClassPage',
    component: ClassPage,
  },
  {
    path: '/background',
    name: 'BackgroundPage',
    component: BackgroundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;