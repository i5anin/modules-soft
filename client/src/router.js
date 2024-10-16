import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/universal',
    name: 'UniversalGet',
    component: () => import('./components/shared/DataTable/UniversalGet.vue'),
  },
  {
    path: '/sborka/:id',
    name: 'SborkaDetails',
    component: () => import('./components/shared/sborka/SborMain.vue'),
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
  {
    path: '/:orderId/:orderId',
    name: 'OrderDetailsDetails',
    component: () => import('./components/form-3/OrderInfoPlus.vue'),
  },
]

export default createRouter({
  routes,
  history: createWebHistory(),
})
