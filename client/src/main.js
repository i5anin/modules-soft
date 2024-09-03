import { createApp } from 'vue';
import router from './router.js';
import { createPinia } from "pinia";

import App from './App.vue';

const app = createApp(App);
const pinia = createPinia(); // Создаем экземпляр Pinia

app.use(router)
    .use(pinia) // Подключаем экземпляр Pinia
    .mount('#app');