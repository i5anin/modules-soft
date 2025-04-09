<template>
  <div>
    <h6>{{ tableTitle }}</h6>
    <table class="table-base table table-sm mt-3 table-bordered table-hover">
      <thead>
        <tr>
          <th v-for="field in filteredFields" :key="field.key">
            {{ field.title }}
            <span v-if="field.permissions.update" title="Можно редактировать">
              <SvgIcon
                v-if="field.permissions.update"
                color="gray"
                type="mdi"
                :path="mdiPencil"
                style="width: 12px; height: 12px"
              />
            </span>
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
            :key="field.key"
            @click="field.update ? null : openModal(row, field)"
          >
            <!-- Если поле редактируемое, отображаем инпут прямо в таблице -->
            <template v-if="field.permissions.update">
              <template v-if="typeof row[field.key] === 'boolean'">
                <!-- Checkbox для булевых значений -->
                <input
                  v-model="row[field.key]"
                  type="checkbox"
                  class="form-check-input"
                />
              </template>
              <template v-else>
                <!-- Текстовый инпут для остальных типов -->
                <input
                  v-model="row[field.key]"
                  type="text"
                  class="form-control"
                />
              </template>
            </template>
            <template v-else>
              <StatusDisplay v-if="field.key === 'statuses'" :row="row" />
              <span v-else>
                {{ formatValue(row[field.key], field.type, field.key) }}
              </span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import StatusDisplay from '@/shared/components/ui/StatusDisplay.vue'
  import { computed, ref } from 'vue'
  import { formatValue } from '@/utils/formatters.js'
  import { mdiPencil } from '@mdi/js'
  import SvgIcon from '@jamescoyle/vue-icon'

  const props = defineProps({
    fields: { type: Array, required: true },
    data: { type: Array, required: true },
    tableTitle: { type: String, default: 'Таблица' },
    excluded: { type: Array, default: () => [] },
    rowLink: { type: Boolean, default: false },
    linkPath: { type: Function, default: null },
  })

  const selectedRow = ref(null)
  const selectedField = ref(null)

  const filteredFields = computed(() =>
    props.fields.filter((field) => !props.excluded.includes(field.key))
  )

  const openModal = (row, field) => {
    selectedRow.value = row
    selectedField.value = field
  }
</script>

<style>
  .table-base {
    border-radius: 12px !important;
  }
</style>
