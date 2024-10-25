<template>
  <div class="col-6">
    <div v-for="(field, index) in fields" :key="index" class="mb-1">
      <strong>{{ field.title }}:</strong>
      {{ formatValue(data[field.name], field.name) }}
    </div>
  </div>
</template>

<script setup>
import { formatValue } from '@/utils/formatters.js'

const props = defineProps({
  fields: { type: Array, required: true },
  data: { type: Object, required: true },
})
</script>

<style scoped>
.mb-1 {
  margin-bottom: 1rem;
}
</style>
