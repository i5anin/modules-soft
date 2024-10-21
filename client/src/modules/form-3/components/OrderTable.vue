<template>
  <div>
    <h5 class="mt-4 display-6 mb-4">{{ tableTitle || 'Таблица' }}</h5>
    <!-- Название таблицы -->
    <table class="table table-striped table-sm mt-3">
      <thead>
        <tr>
          <th v-for="(field, index) in fields" :key="index">
            {{ field.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="(field, index) in fields" :key="index">
            {{ formatValue(row[field.name], field.name) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {
  formatBoolean,
  formatDate,
  formatPrice,
  formatTime,
} from '@/utils/formatters.js'
import _ from 'lodash'

defineProps({
  fields: { type: Array, required: true },
  data: { type: Array, required: true },
  tableTitle: { type: String, required: true }, // Добавляем пропс для названия таблицы
})

const formatValue = (value, fieldName) => {
  if (typeof value === 'boolean') {
    return formatBoolean(value)
  } else if (
    typeof value === 'string' &&
    _.includes(fieldName.toLowerCase(), 'date')
  ) {
    return formatDate(value)
  } else if (
    typeof value === 'number' &&
    _.includes(fieldName.toLowerCase(), 'time')
  ) {
    return formatTime(value)
  } else if (_.includes(fieldName.toLowerCase(), 'price')) {
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue)) {
      return formatPrice(numericValue)
    }
  }
  return value
}
</script>
