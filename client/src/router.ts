import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// Определяем типы маршрутов
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'OrdersTable',
    component: () => import('./modules/form-1/components/Index.vue'),
  },
  {
    path: '/:orderId',
    name: 'OrderDetails',
    component: () => import('./modules/form-2/components/Index.vue'),
    props: true, // позволяет передавать orderId как параметр
  },
  {
    path: '/:orderId/:id',
    name: 'OrderDetailsDetails',
    component: () => import('./modules/form-3/components/index.vue'),
    props: true, // позволяет передавать orderId и id как параметры
  },
  {
    path: '/sborka-test/:id',
    name: 'SborkaDetails',
    component: () => import('./modules/shared/sborka/SborMain.vue'),
    props: true, // передача id как параметра
  },
  {
    path: '/modal-tools-test/:no/:nomId',
    name: 'modal-tools',
    component: () => import('./modules/modal-tools/components/index.vue'),
    props: true, // передача no и nomId как параметров
  },
]

// Экспорт маршрутизатора с типизацией
export default createRouter({
  history: createWebHistory(),
  routes,
})
