import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import CharacterListPage from '../pages/CharacterListPage.vue';
import CharacterDetailPage from '../pages/CharacterDetailPage.vue';
import AddItemPage from '../pages/AddItemPage.vue';

const routes = [
    {
      path: '/',
      name: 'Home',
      component: LoginPage, // Set the component for the base path
    },
    {
        path: '/characters',
        name: 'CharacterList',
        component: CharacterListPage,
    },
    {
        path: '/characters/:id',
        name: 'CharacterDetail',
        component: CharacterDetailPage,
    },
    {
        path: '/characters/:id/add',
        name: 'AddItem',
        component: AddItemPage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
