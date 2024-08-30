import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        component: () => import('./pages/Home.vue'),
    },
    {
        path: '/add',
        component: () => import('./pages/Add.vue'),
    }
]

export default createRouter({
    routes,
    history: createWebHistory()
})