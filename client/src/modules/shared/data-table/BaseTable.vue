<template>
  <div>
    <h5 class="mt-4">{{ tableTitle }}</h5>
    <table class="table table-striped table-sm mt-3 table-bordered table-hover">
      <thead>
        <tr>
          <!-- Теперь ключи фильтруются из объекта, а не массива -->
          <th v-for="(field, fieldName) in filteredFields" :key="fieldName">
            {{ field.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          @click="openModal(row)"
          :style="rowLink ? 'cursor: pointer;' : ''"
        >
          <!-- Используем fieldName для доступа к данным строки -->
          <td v-for="(field, fieldName) in filteredFields" :key="fieldName">
            <StatusDisplay v-if="fieldName === 'statuses'" :row="row" />
            <span v-else>{{ formatValue(row[fieldName], fieldName) }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <EditableModal
      v-if="selectedRow"
      :rowData="selectedRow"
      :fields="filteredFields"
      @close="selectedRow = null"
    />
  </div>
</template>

<script setup>
import StatusDisplay from './StatusDisplay.vue'
import EditableModal from './BaseTableEditableModal.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatValue } from '@/utils/formatters.ts'

const props = defineProps({
  fields: { type: Object, required: true }, // Изменяем на Object для нового формата
  data: { type: Array, required: true },
  tableTitle: { type: String, default: 'Таблица' },
  excluded: { type: Array, default: () => [] },
  rowLink: { type: Boolean, default: false },
  linkPath: { type: Function, default: null },
})

const router = useRouter()
const selectedRow = ref(null)

// Фильтрация полей с учетом новой структуры
const filteredFields = computed(() => {
  const fields = props.fields
  return Object.fromEntries(
    Object.entries(fields).filter(
      ([fieldName]) => !props.excluded.includes(fieldName)
    )
  )
})

const openModal = (row) => {
  selectedRow.value = row
  if (props.rowLink && props.linkPath) {
    router.push(props.linkPath(row))
  }
}
</script>
