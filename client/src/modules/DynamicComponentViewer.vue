<template>
  <div>
    <InfoComponent :targetComponent="PagesClients" />
  </div>
</template>

<script>
import PagesClients from '@/modules/clients-noms/form-2-noms/components/PagesClientNoms.vue';
import InfoComponent from './InfoComponent.vue';

export default {
  components: {
    InfoComponent,
  },
  setup() {
    return {
      PagesClients, // Импортируем описание компонента
    };
  },
};
</script>
