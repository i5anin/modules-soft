<template>
  <div>
    <InfoComponent :targetComponent="PagesClients" />
  </div>
</template>

<script setup>
import PagesClients from '@/modules/clients-noms/form-2-noms/components/PagesClientNoms.vue';
import InfoComponent from './InfoComponent.vue';
</script>
