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
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          @click="handleRowClick(row)"
          :style="rowLink ? 'cursor: pointer;' : ''"
        >
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
import { useRouter } from 'vue-router'

const props = defineProps({
  fields: { type: Array, required: true },
  data: { type: Array, required: true },
  tableTitle: { type: String, default: 'Таблица' },
  excluded: { type: Array, default: () => [] },
  rowLink: { type: Boolean, default: false }, // Новый пропс для активации маршрутизации
  linkPath: { type: Function, default: null }, // Новый пропс для определения маршрута
})

const router = useRouter()

const filteredFields = computed(() => {
  return props.fields.filter((field) => !props.excluded.includes(field.name))
})

const handleRowClick = (row) => {
  if (props.rowLink && props.linkPath) {
    const path = props.linkPath(row) // Генерация пути из функции
    if (path) {
      router.push(path)
    }
  }
}
</script>
