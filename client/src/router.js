import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        name: 'OrdersTable',
        component: () => import('./pages/Home.vue'),
    },
    {
        path: '/add',
        component: () => import('./pages/Add.vue'),
    },
    // Добавленный маршрут для OrderDetails
    {
        path: '/:orderId',
        name: 'OrderDetails',
        component: () => import('./components/order-num-table/OrderNomTable.vue')
    }
];

export default createRouter({
    routes,
    history: createWebHistory()
})