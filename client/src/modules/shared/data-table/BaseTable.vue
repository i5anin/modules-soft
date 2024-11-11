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
          :style="rowLink ? 'cursor: pointer;' : ''"
        >
          <td
            v-for="field in filteredFields"
            :key="field.name"
            @click="field.edit ? null : openModal(row, field)"
          >
            <!-- Если поле редактируемое, отображаем инпут прямо в таблице -->
            <template v-if="field.edit">
              <template v-if="typeof row[field.name] === 'boolean'">
                <!-- Checkbox для булевых значений -->
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="row[field.name]"
                />
              </template>
              <template v-else>
                <!-- Текстовый инпут для остальных типов -->
                <input
                  type="text"
                  class="form-control"
                  v-model="row[field.name]"
                />
              </template>
            </template>
            <template v-else>
              <StatusDisplay v-if="field.name === 'statuses'" :row="row" />
              <span v-else>{{ formatValue(row[field.name], field.name) }}</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Модальное окно для одного редактируемого поля -->
    <EditableModal
      v-if="selectedRow && selectedField"
      :rowData="selectedRow"
      :field="selectedField"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import StatusDisplay from '@/modules/shared/StatusDisplay.vue'
import EditableModal from './BaseTableEditableModal.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatValue } from '@/utils/formatters-2.ts'

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
const selectedField = ref(null)

const filteredFields = computed(() =>
  props.fields.filter((field) => !props.excluded.includes(field.name))
)

const openModal = (row, field) => {
  selectedRow.value = row
  selectedField.value = field
}

const closeModal = () => {
  selectedRow.value = null
  selectedField.value = null
}
</script>
