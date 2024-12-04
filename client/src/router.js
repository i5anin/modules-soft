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
      import('@/modules/shared-form-2-card-noms/components/PagesCardNoms.vue'),
    props: true,
  },
  {
    path: '/order/:orderId/nom/:id',
    name: 'OrderDetails',
    component: () =>
      import(
        '@/modules/shared-form-3-nom/components/PagesDetailOrderAndNom.vue'
      ),
    props: (route) => ({ ...route.params, type: 'orders' }),
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
    path: '/client/:clientId/noms',
    name: 'Noms',
    component: () =>
      import(
        '@/modules/clients-noms/form-2-clients-noms/components/PagesClientNoms.vue'
      ),
    props: true,
  },
  {
    path: '/client/:clientId/nom/:id',
    name: 'NomDetails',
    component: () =>
      import(
        '@/modules/shared-form-3-nom/components/PagesDetailOrderAndNom.vue'
      ),
    props: (route) => ({ ...route.params, type: 'nom' }),
  },
]

const commercialRoutes = [
  {
    path: '/commercials',
    name: 'Commercial',
    component: () =>
      import('@/modules/commercial/form-1-kp/components/PagesCommercial.vue'),
  },
  {
    path: '/commercial/:kpId/noms',
    name: 'CommercialNomDetails',
    component: () =>
      import('@/modules/shared-form-2-card-noms/components/PagesCardNoms.vue'),
    props: (route) => ({ ...route.params, type: 'kp' }),
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
    path: '/docs',
    name: 'Docs',
    component: () => import('@/pages/admin/dynamic-docs/PagesViewer.vue'),
    props: true,
  },
]

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/admin/Home.vue'),
  },
  ...commercialRoutes,
  ...ordersRoutes,
  ...clientsRoutes,
  ...testRoutes,
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
