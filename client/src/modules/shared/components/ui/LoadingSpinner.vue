<template>
  <div
    class="loading-spinner"
    :style="{ padding }"
  >
    <div
      class="spinner-border"
      role="status"
    >
      <span class="visually-hidden"> Загрузка... </span>
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'

  defineProps({
    padding: { type: String, default: '35vh 0' },
  })
</script>

<style scoped>
  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .spinner-border {
    width: 3rem;
    height: 3rem;
  }
</style>
