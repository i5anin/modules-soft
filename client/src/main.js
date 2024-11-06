import { createApp } from 'vue'
import router from './router.ts'
import { createPinia } from 'pinia'

import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css' // Import Bootstrap CSS
import 'bootstrap' // Import Bootstrap JS

const app = createApp(App)
const pinia = createPinia() // Создаем экземпляр Pinia

app
  .use(router)
  .use(pinia) // Подключаем экземпляр Pinia
  .mount('#app')
