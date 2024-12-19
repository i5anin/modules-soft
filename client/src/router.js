import { createRouter, createWebHistory } from 'vue-router'

const ordersRoutes = [
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/pages/form-1/PagesTableWrapper.vue'),
    props: (route) => ({
      ...route.params,
      type: 'orders',
      route: 'Order',
    }),
  },
  {
    path: '/order/:id/noms',
    name: 'Order',
    component: () => import('@/pages/form-2/PagesCardNoms.vue'),
    props: (route) => ({
      ...route.params,
      type: 'orders',
      route: 'OrderDetails',
    }),
  },
  {
    path: '/order/:id/nom/:nom_id',
    name: 'OrderDetails',
    component: () => import('@/pages/form-3/PagesDetailOrderAndNom.vue'),
    props: (route) => ({
      ...route.params,
      type: 'orders',
    }),
  },
]

const clientsRoutes = [
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('@/pages/form-1/PagesClients.vue'),
    props: (route) => ({
      ...route.params,
      edit: true,
    }),
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
    component: () => import('@/pages/form-1/PagesTableWrapper.vue'),
    props: (route) => ({
      ...route.params,
      type: 'kp',
      route: 'CommercialNomDetails',
    }),
  },
  {
    path: '/commercial/:id/noms',
    name: 'CommercialNomDetails',
    component: () => import('@/pages/form-2/PagesCardNoms.vue'),
    props: (route) => ({
      ...route.params,
      type: 'kp',
    }),
  },
]

const specificationsRoutes = [
  {
    path: '/specs',
    name: 'Specifications',
    component: () => import('@/pages/form-1/PagesTableWrapper.vue'),
    props: (route) => ({
      ...route.params,
      type: 'specs',
      route: 'SpecificationsNomDetails',
    }),
  },
  {
    path: '/spec/:id/noms',
    name: 'SpecificationsNomDetails',
    component: () => import('@/pages/form-2/PagesCardNoms.vue'),
    props: (route) => ({
      ...route.params,
      type: 'specs',
      route: 'SpecNomDetails',
    }),
  },
  {
    path: '/spec/:id/nom/:nom_id',
    name: 'SpecNomDetails',
    component: () => import('@/pages/form-3/PagesDetailOrderAndNom.vue'),
    props: (route) => ({ ...route.params, type: 'specs' }),
  },
]

const devRoutes = [
  {
    path: '/dev/modal-tools/:no/:nomId',
    name: 'ModalTools',
    component: () =>
      import('@/modules/modal-tools/components/PagesModalTools.vue'),
    props: true,
  },
  {
    path: '/dev/docs',
    name: 'Docs',
    component: () => import('@/pages/admin/dynamic-docs/PagesViewer.vue'),
    props: true,
  },
  {
    path: '/dev/fields-processor',
    name: 'devFieldsProcessor',
    component: () => import('@/modules/dev/fieldsProcessor.vue'),
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
  ...devRoutes,
  ...specificationsRoutes,
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
