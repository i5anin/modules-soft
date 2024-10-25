import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'OrdersTable',
    component: () => import('./modules/form-1/components/_MainOrders.vue'),
  },
  {
    path: '/:orderId',
    name: 'OrderDetails',
    component: () => import('./modules/form-2/components/_MainDetails.vue'),
  },
  {
    path: '/:orderId/:id',
    name: 'OrderDetailsDetails',
    component: () => import('./modules/form-3/components/_NomInfo.vue'),
  },
  {
    path: '/sborka/:id',
    name: 'SborkaDetails',
    component: () => import('./modules/shared/sborka/SborMain.vue'),
  },

  {
    path: '/test',
    name: 'ParentComponent',
    component: () => import('./test/_ParentComponent.vue'),
  },
]

export default createRouter({
  routes,
  history: createWebHistory(),
})
