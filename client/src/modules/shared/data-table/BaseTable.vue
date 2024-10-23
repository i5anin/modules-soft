<template>
  <div>
    <h5 class="mt-4">{{ tableTitle }}</h5>
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
            <StatusDisplay v-if="field.name === 'statuses'" :row="row" />
            <span v-else>{{ formatValue(row[field.name], field.name) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import StatusDisplay from './StatusDisplay.vue'
import { computed } from 'vue'
import { formatValue } from '@/utils/formatters.js'

const props = defineProps({
  fields: { type: Array, required: true },
  data: { type: Array, required: true },
  tableTitle: { type: String, default: 'Таблица' },
  excluded: { type: Array, default: () => [] },
})

const filteredFields = computed(() => {
  return props.fields.filter((field) => !props.excluded.includes(field.name))
})
</script>
