<template>
  <ul class="list-group">
    <li
      v-for="child in childrenList"
      :key="child.name || child.__file"
      class="list-group-item"
    >
      <InfoComponent :target-component="child" />
    </li>
  </ul>
</template>

<script setup>
  import InfoComponent from '../InfoComponent.vue'

  defineProps({
    childrenList: {
      type: Array,
      required: true,
    },
  })
</script>

<style scoped>
  /* Стили, если нужны */
</style>
