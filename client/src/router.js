import { createRouter, createWebHistory } from 'vue-router'

const ordersRoutes = [
  {
    path: '/orders',
    name: 'Orders',
    component: () =>
      import('@/modules/orders/form-1-orders/components/PagesOrders.vue'),
  },
  {
    path: '/order/:orderId/noms',
    name: 'Order',
    component: () =>
      import(
        '@/modules/orders/form-2-noms/components/PagesNomsOrderDetail.vue'
      ),
    props: true,
  },
  {
    path: '/order/:orderId/nom/:idOrder',
    name: 'OrderDetails',
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
    path: '/client/:clientId',
    name: 'Noms',
    component: () =>
      import('@/modules/clients-noms/form-2-noms/components/PagesNoms.vue'),
    props: true,
  },
  {
    path: '/client/:clientId/nom/:nomId',
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
    path: '/test/modal-tools/:no/:nomId',
    name: 'ModalTools',
    component: () =>
      import('@/modules/orders/modal-tools/components/PagesModalTools.vue'),
    props: true,
  },
  {
    path: '/test/modal-zag',
    name: 'ZagotovkaInfo',
    component: () =>
      import('@/modules/shared/zagotovka/PagesZagotovkaInfo.vue'),
    props: true,
  },
]

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  ...ordersRoutes,
  ...clientsRoutes,
  ...testRoutes,
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
