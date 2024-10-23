<template>
  <div>
    <h5 class="mt-4">{{ tableTitle || 'Таблица' }}</h5>
    <table class="table table-striped table-sm mt-3">
      <thead>
        <tr>
          <th v-for="(field, index) in filteredFields" :key="index">
            {{ field.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="(field, index) in filteredFields" :key="index">
            {{ formatValue(row[field.name], field.name) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  formatBoolean,
  formatDate,
  formatPrice,
  formatTime,
} from '@/utils/formatters.js'
import _ from 'lodash'

const props = defineProps({
  fields: { type: Array, required: true },
  data: { type: Array, required: true },
  tableTitle: { type: String, required: true },
  excluded: { type: Array, default: () => [] },
})

// Фильтруем поля, исключая те, которые указаны в excluded
const filteredFields = computed(() => {
  return props.fields.filter((field) => !props.excluded.includes(field.name))
})

const formatValue = (value, fieldName) => {
  if (typeof value === 'boolean') return formatBoolean(value)
  if (typeof value === 'string' && fieldName.toLowerCase().includes('date'))
    return formatDate(value)
  if (typeof value === 'number' && fieldName.toLowerCase().includes('time'))
    return formatTime(value)
  if (fieldName.toLowerCase().includes('price') && !isNaN(parseFloat(value)))
    return formatPrice(parseFloat(value))
  return value
}
</script>
