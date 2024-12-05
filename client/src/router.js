import { createRouter, createWebHistory } from 'vue-router'

const ordersRoutes = [
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/pages/form-1/PagesOrders.vue'),
  },
  {
    path: '/order/:id/noms',
    name: 'Order',
    component: () => import('@/pages/form-2/PagesCardNoms.vue'),
    props: (route) => ({ ...route.params, type: 'orders' }),
  },
  {
    path: '/order/:orderId/nom/:id',
    name: 'OrderDetails',
    component: () => import('@/pages/form-3/PagesDetailOrderAndNom.vue'),
    props: (route) => ({ ...route.params, type: 'orders' }),
  },
]

const clientsRoutes = [
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('@/pages/form-1/PagesClients.vue'),
    props: true,
  },
  {
    path: '/client/:clientId/noms',
    name: 'Noms',
    component: () => import('@/pages/form-2/PagesClientNoms.vue'),
    props: true,
  },
  {
    path: '/client/:clientId/nom/:id',
    name: 'NomDetails',
    component: () => import('@/pages/form-3/PagesDetailOrderAndNom.vue'),
    props: (route) => ({ ...route.params, type: 'nom' }),
  },
]

const commercialRoutes = [
  {
    path: '/commercials',
    name: 'Commercial',
    component: () => import('@/pages/form-1/PagesCommercial.vue'),
  },
  {
    path: '/commercial/:kpId/noms',
    name: 'CommercialNomDetails',
    component: () => import('@/pages/form-2/PagesCardNoms.vue'),
    props: (route) => ({ ...route.params, type: 'kp' }),
  },
]

const testRoutes = [
  {
    path: '/test/modal-tools/:no/:nomId',
    name: 'ModalTools',
    component: () =>
      import('@/modules/modal-tools/components/PagesModalTools.vue'),
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
