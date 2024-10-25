<template>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th v-for="field in fields" :key="field.name">{{ field.title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, index) in data"
        :key="index"
        @click="onRowClick(row)"
        style="cursor: pointer"
      >
        <td v-for="field in fields" :key="field.name">{{ row[field.name] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  fields: {
    type: Array,
    required: true,
    default: () => [],
  },
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['row-clicked'])

const onRowClick = (row) => {
  emit('row-clicked', row)
}
</script>

<style scoped>
/* Дополнительные стили при необходимости */
</style>
