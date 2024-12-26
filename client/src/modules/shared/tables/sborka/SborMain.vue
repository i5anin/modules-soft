<template>
  <div class="row">
    <div class="col-12">
      <!-- Сообщение при отсутствии данных -->
      <div v-if="tableData.length === 0" class="alert alert-warning">
        Нет данных.
      </div>
      <div v-else>
        <table
          class="table-sbor table table-bordered table-striped table-sm table-hover"
        >
          <thead>
            <tr style="font-size: 12px">
              <th scope="col" style="width: 30px" title="развернуть"></th>
              <th scope="col" style="width: 30px" title="статусы"></th>
              <th
                v-for="field in filteredFields"
                :key="field.name"
                :style="{ width: field.width || 'auto' }"
              >
                {{ field.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <SborRow
              v-for="sbor in tableData"
              :key="sbor.id"
              :sbor="sbor"
              :depth="0"
              :detail="detail"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import SborRow from './SborRow.vue'
import { store } from './store.js'

// Props
const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
  tableFields: {
    type: Array,
    required: true,
  },
  detail: {
    type: Object,
    required: true,
  },
})

// Store
const sborStore = store()

// Computed
const filteredFields = computed(() => sborStore.filteredFields)

// Watchers
watch(
  () => props.tableData,
  (newData) => {
    sborStore.setTableData(newData)
  },
  { immediate: true }
)

watch(
  () => props.tableFields,
  (newFields) => {
    sborStore.setTableFields(newFields)
  },
  { immediate: true }
)
</script>
