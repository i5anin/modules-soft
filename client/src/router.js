import { createRouter, createWebHistory } from 'vue-router'

const ordersRoutes = [
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
]

const clientsRoutes = [
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
    name: 'Noms',
    component: () =>
      import('@/modules/clients-noms/form-2-noms/components/PagesNoms.vue'),
    props: true,
  },
  {
    path: '/noms/:clientId/:nomId',
    name: 'NomDetails',
    component: () =>
      import(
        '@/modules/clients-noms/form-3-nom/components/PagesNomOrderDetail.vue'
      ),
    props: true,
  },
]

const testRoutes = [
  {
    path: '/test/sborka/:id',
    name: 'SborkaDetails',
    component: () => import('@/modules/shared/table/sborka/SborMain.vue'),
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

const routes = [
  {
    path: '/',
    redirect: '/orders',
  },
  ...ordersRoutes,
  ...clientsRoutes,
  ...testRoutes,
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
