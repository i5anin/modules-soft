import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/entities/auth/authStore'

const authRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue'),
    meta: { title: 'Вход', public: true },
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore() // ✅ Используем store
      authStore.logout() // ✅ Вызываем метод logout()
      next('/login')
    },
    meta: { public: true },
  },
]

const ordersRoutes = [
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/pages/form-1/PagesTableWrapper.vue'),
    meta: { title: 'Заказы' },
    props: route => ({
      ...route.params,
      type: 'orders',
      route: 'Order',
    }),
  },
  {
    path: '/order/:id/noms',
    name: 'Order',
    component: () => import('@/pages/form-2/PagesCardNoms.vue'),
    meta: { title: 'Детали заказа' },
    props: route => ({
      ...route.params,
      type: 'orders',
      route: 'OrderDetails',
    }),
  },
  {
    path: '/order/:id/nom/:nom_id',
    name: 'OrderDetails',
    component: () => import('@/pages/form-3/PagesDetailNom.vue'),
    meta: { title: 'Детали позиции заказа' },
    props: route => ({
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
    meta: { title: 'Клиенты' },
    props: route => ({
      route: 'Noms',
      ...route.params,
      edit: true,
      type: 'nom',
    }),
  },
  {
    path: '/client/:clientId/noms',
    name: 'Noms',
    component: () => import('@/pages/form-2/PagesClientNoms.vue'),
    meta: { title: 'Номенклатура клиента' },
    props: route => ({
      route: 'NomDetails',
      ...route.params,
      edit: true,
      type: 'nom',
    }),
  },
  {
    path: '/client/:clientId/nom/:nom_id',
    name: 'NomDetails',
    component: () => import('@/pages/form-3/PagesDetailNom.vue'),
    meta: { title: 'Детали номенклатуры клиента' },
    props: route => ({ ...route.params, type: 'nom' }),
  },
]

const commercialRoutes = [
  {
    path: '/commercials',
    name: 'Commercial',
    component: () => import('@/pages/form-1/PagesTableWrapper.vue'),
    meta: { title: 'Коммерческие предложения' },
    props: route => ({
      ...route.params,
      type: 'kp',
      route: 'CommercialNomDetails',
    }),
  },
  {
    path: '/commercial/:id/noms',
    name: 'CommercialNomDetails',
    component: () => import('@/pages/form-2/PagesCardNoms.vue'),
    meta: { title: 'Детали КП' },
    props: route => ({
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
    meta: { title: 'Спецификации' },
    props: route => ({
      ...route.params,
      type: 'specs',
      route: 'SpecificationsNomDetails',
    }),
  },
  {
    path: '/spec/:id/noms',
    name: 'SpecificationsNomDetails',
    component: () => import('@/pages/form-2/PagesCardNoms.vue'),
    meta: { title: 'Детали спецификации' },
    props: route => ({
      ...route.params,
      type: 'specs',
      route: 'SpecNomDetails',
    }),
  },
  {
    path: '/spec/:id/nom/:nom_id',
    name: 'SpecNomDetails',
    component: () => import('@/pages/form-3/PagesDetailNom.vue'),
    meta: { title: 'Детали позиции спецификации' },
    props: route => ({ ...route.params, type: 'specs' }),
  },
]

const devRoutes = [
  {
    path: '/dev/modal-tools/:no/:nomId',
    name: 'ModalTools',
    component: () =>
      import('@/modules/modal-tools/components/PagesModalTools.vue'),
    meta: { title: 'Инструменты модальных окон' },
    props: true,
  },
  {
    path: '/dev/docs',
    name: 'Docs',
    component: () => import('@/pages/admin/dynamic-docs/PagesViewer.vue'),
    meta: { title: 'Документация' },
    props: true,
  },
  {
    path: '/dev/fields-processor',
    name: 'devFieldsProcessor',
    component: () => import('@/modules/dev/fieldsProcessor.vue'),
    meta: { title: 'Обработка полей (Processor)' },
    props: true,
  },
]

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/admin/Home.vue'),
    meta: { title: 'Список маршрутов' },
  },
  ...authRoutes,
  ...commercialRoutes,
  ...ordersRoutes,
  ...clientsRoutes,
  ...devRoutes,
  ...specificationsRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const defaultTitle = 'Сервисный'

  document.title = to.meta.title || defaultTitle

  if (!to.meta.public && !isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router
