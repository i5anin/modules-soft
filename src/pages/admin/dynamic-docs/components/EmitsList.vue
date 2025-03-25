<template>
  <ul class="list-group">
    <li v-for="event in emitsList" :key="event" class="list-group-item">
      {{ event }}
    </li>
  </ul>
</template>

<script setup>
  defineProps({
    emitsList: {
      type: Array,
      required: true,
    },
  })
</script>

<style scoped>
  /* Стили, если нужны */
</style>
