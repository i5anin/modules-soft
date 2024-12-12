import { createRouter, createWebHistory } from 'vue-router'

const ordersRoutes = [
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/pages/form-1/PagesTableWrapper.vue'),
    props: (route) => ({
      ...route.params,
      type: 'orders',
      link: 'id',
      route: 'Order',
      edit: false,
    }),
  },
  {
    path: '/order/:id/noms',
    name: 'Order',
    component: () => import('@/pages/form-2/PagesCardNoms.vue'),
    props: (route) => ({
      ...route.params,
      type: 'orders',
      link: 'ordersnom_id',
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
    props: (route) => ({ ...route.params, edit: true }),
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
      link: 'kp_list__id',
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
      link: 'kp_data__id',
      route: 'kpNomDetails',
    }),
  },
  {
    path: '/commercial/:id/nom/:nom_id',
    name: 'kpNomDetails',
    component: () => import('@/pages/form-3/PagesDetailOrderAndNom.vue'),
    props: (route) => ({ ...route.params, type: 'kp' }),
  },
]

const specificationsRoutes = [
  {
    path: '/specifications',
    name: 'Specifications',
    component: () => import('@/pages/form-1/PagesTableWrapper.vue'),
    props: (route) => ({
      ...route.params,
      type: 'specs',
      link: 'specs__id',
      route: 'SpecificationsNomDetails',
    }),
  },
  {
    path: '/specification/:id/noms',
    name: 'SpecificationsNomDetails',
    component: () => import('@/pages/form-2/PagesCardNoms.vue'),
    props: (route) => ({
      ...route.params,
      type: 'specs',
      link: 'specs_nom__id',
      route: 'SpecNomDetails',
    }),
  },
  {
    path: '/specification/:id/nom/:nom_id',
    name: 'SpecNomDetails',
    component: () => import('@/pages/form-3/PagesDetailOrderAndNom.vue'),
    props: (route) => ({ ...route.params, type: 'specs' }),
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
  {
    path: '/fields-processor',
    name: 'TestFieldsProcessor',
    component: () => import('@/modules/test/fieldsProcessor.vue'),
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
  ...specificationsRoutes,
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
