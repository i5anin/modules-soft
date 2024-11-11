import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// Определяем типы маршрутов
const routes: Array<RouteRecordRaw> = [
  {
    path: '/orders',
    name: 'OrdersTable',
    component: () =>
      import('@/modules/orders/form-1-orders/components/index.vue'),
  },
  {
    path: '/orders/:orderId',
    name: 'OrderDetails',
    component: () =>
      import('@/modules/orders/form-2-noms/components/index.vue'),
    props: true, // позволяет передавать orderId как параметр
  },
  {
    path: '/orders/:orderId/:id',
    name: 'OrderDetailsDetails',
    component: () => import('@/modules/orders/form-3-nom/components/index.vue'),
    props: true, // позволяет передавать orderId и id как параметры
  },
  {
    path: '/nomenclatures/:clientId',
    name: 'Nomenclature',
    component: () =>
      import('@/modules/nomenclatures/form-2-client-noms/components/index.vue'),
    props: true,
  },
  {
    path: '/test/sborka/:id',
    name: 'SborkaDetails',
    component: () => import('@/modules/shared/sborka/SborMain.vue'),
    props: true, // передача id как параметра
  },
  {
    path: '/test/modal-tools/:no/:nomId',
    name: 'modal-tools',
    component: () =>
      import('@/modules/orders/modal-tools/components/index.vue'),
    props: true, // передача no и nomId как параметров
  },
]

// Экспорт маршрутизатора с типизацией
export default createRouter({
  history: createWebHistory(),
  routes,
})
