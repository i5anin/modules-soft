import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'OrdersTable',
    component: () => import('./pages/Home.vue'),
  },
  {
    path: '/:orderId',
    name: 'OrderDetails',
    component: () => import('./modules/form-2/components/_OrderDetails.vue'),
  },
  {
    path: '/:orderId/:Id',
    name: 'OrderDetailsDetails',
    component: () => import('./modules/form-3/components/_NomInfo.vue'),
  },

  {
    path: '/universal',
    name: 'UniversalGet',
    component: () => import('./modules/shared/data-table/UniversalGet.vue'),
  },
  {
    path: '/sborka/:id',
    name: 'SborkaDetails',
    component: () => import('./modules/shared/sborka/SborMain.vue'),
  },

  // {
  //   path: '/:orderId/:orderId',
  //   name: 'OrderDetailsDetails',
  //   component: () => import('./modules/form-3/components/OrderInfoPlus.vue'),
  // },
  // {
  //   path: '/add',
  //   component: () => import('./pages/Add.vue'),
  // },
]

export default createRouter({
  routes,
  history: createWebHistory(),
})
