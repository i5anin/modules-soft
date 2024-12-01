<template>
  <div>
    <InfoComponent :targetComponent="PagesClientsInstance" />

  </div>
</template>

<script>
import { createApp } from 'vue';
import PagesClients from '@/modules/clients-noms/form-2-noms/components/PagesClientNoms.vue';
import InfoComponent from './InfoComponent.vue';

export default {
  components: {
    InfoComponent,
  },
  setup() {
    // Создаём приложение
    const app = createApp(PagesClients);

    // Монтируем приложение на временный элемент
    const tempElement = document.createElement('div');
    const PagesClientsInstance = app.mount(tempElement);

    return {
      PagesClientsInstance, // Возвращаем экземпляр компонента
    };
  },
};

</script>
