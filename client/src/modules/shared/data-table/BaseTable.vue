<template>
  <div>
    <h5 class="mt-4">{{ tableTitle }}</h5>
    <table class="table table-striped table-sm mt-3 table-bordered table-hover">
      <thead>
        <tr>
          <th v-for="field in filteredFields" :key="field.name">
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
          <td v-for="field in filteredFields" :key="field.name">
            <StatusDisplay v-if="field.name === 'statuses'" :row="row" />
            <span v-else>{{ formatValue(row[field.name], field.name) }}</span>
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
import { formatValue } from '@/utils/formatters.js' // Импортируйте вашу функцию форматирования

const props = defineProps({
  fields: { type: Array, required: true },
  data: { type: Array, required: true },
  tableTitle: { type: String, default: 'Таблица' },
  excluded: { type: Array, default: () => [] },
  rowLink: { type: Boolean, default: false },
  linkPath: { type: Function, default: null },
})

const router = useRouter()
const selectedRow = ref(null)

const filteredFields = computed(() =>
  props.fields.filter((field) => !props.excluded.includes(field.name))
)

const openModal = (row) => {
  selectedRow.value = row // Сохраняем выбранную строку
  if (props.rowLink && props.linkPath) {
    router.push(props.linkPath(row)) // Навигация по пути, если нужно
  }
}
</script>
