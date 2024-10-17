import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/universal',
    name: 'UniversalGet',
    component: () => import('./modules/shared/DataTable/UniversalGet.vue'),
  },
  {
    path: '/sborka/:id',
    name: 'SborkaDetails',
    component: () => import('./modules/shared/sborka/SborMain.vue'),
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
    component: () => import('./modules/form-2/components/OrderNomTable.vue'),
  },
  // {
  //   path: '/:orderId/:orderId',
  //   name: 'OrderDetailsDetails',
  //   component: () => import('./modules/form-3/components/OrderInfoPlus.vue'),
  // },
]

export default createRouter({
  routes,
  history: createWebHistory(),
})
