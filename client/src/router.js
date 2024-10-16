import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/Universal',
    name: 'UniversalGet',
    component: () => import('./components/DataTable/UniversalGet.vue'),
  },
  {
    path: '/Sborka',
    name: 'UniversalGet',
    component: () =>
      import('./components/form-2-order-num-table/Sborka/Sborka.vue'),
  },
  {
    path: '/',
    name: 'OrdersTable',
    component: () => import('./pages/Home.vue'),
  },
  {
    path: '/add',
    component: () => import('./pages/Add.vue'),
  },
  {
    path: '/:orderId',
    name: 'OrderDetails',
    component: () =>
      import('./components/form-2-order-num-table/OrderNomTable.vue'),
  },
]

export default createRouter({
  routes,
  history: createWebHistory(),
})
