import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/orders',
  },
  {
    path: '/orders',
    name: 'OrdersTable',
    component: () =>
      import('@/modules/orders/form-1-orders/components/PagesOrders.vue'),
  },
  {
    path: '/orders/:orderId',
    name: 'OrderDetails',
    component: () =>
      import(
        '@/modules/orders/form-2-noms/components/PagesNomsOrderDetail.vue'
      ),
    props: true,
  },
  {
    path: '/orders/:orderId/:id',
    name: 'OrderDetailsDetails',
    component: () =>
      import('@/modules/orders/form-3-nom/components/PagesNomOrderDetail.vue'),
    props: true,
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () =>
      import(
        '@/modules/clients-noms/form-1-clients/components/PagesClients.vue'
      ),
    props: true,
  },
  {
    path: '/noms/:clientId',
    name: 'Nomenclature',
    component: () =>
      import('@/modules/clients-noms/form-2-noms/components/PagesNoms.vue'),
    props: true,
  },
  {
    path: '/test/sborka/:id',
    name: 'SborkaDetails',
    component: () => import('@/modules/shared/sborka/SborMain.vue'),
    props: true,
  },
  {
    path: '/test/modal-tools/:no/:nomId',
    name: 'modal-tools',
    component: () =>
      import('@/modules/orders/modal-tools/components/PagesModalTools.vue'),
    props: true,
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
