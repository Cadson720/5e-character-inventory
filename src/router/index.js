import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '@/pages/HelloWorld.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld, // Route to the Hello World page
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
