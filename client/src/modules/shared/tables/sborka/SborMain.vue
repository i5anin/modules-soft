<template>
  <PendingUpdatesOverlay />
  <div class="row">
    <div class="col-12">
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
                v-for="(field, colIndex) in filteredFields"
                :key="field.name"
                :style="{ width: field.width || 'auto' }"
              >
                {{ field.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <SborRow
              v-for="(sbor, rowIndex) in tableData"
              :key="sbor.id"
              :sbor="sbor"
              :fields="filteredFields"
              :depth="0"
              :detail="detail"
              :rowIndex="rowIndex"
              :rowSpanMatrix="rowSpanMatrix"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SborRow from './SborRow.vue'
import PendingUpdatesOverlay from './PendingUpdatesOverlay.vue'

// Props
const props = defineProps({
  tableData: { type: Array, required: true },
  tableFields: { type: Array, required: true },
  detail: { type: Object, required: true },
})

// Фильтруем доступные поля
const filteredFields = computed(() =>
  props.tableFields.filter(
    field => field.permissions.read || field.permissions.update
  )
)

// Вычисление `rowSpanMatrix` с учетом `nom_code`
const rowSpanMatrix = computed(() => {
  if (!props.tableData.length) return []

  const totalRows = props.tableData.length
  const totalCols = filteredFields.value.length

  const matrix = Array.from({ length: totalRows }, () =>
    Array(totalCols).fill(1)
  )

  for (let colIndex = 0; colIndex < totalCols; colIndex++) {
    const field = filteredFields.value[colIndex]
    if (!field.canMergeCells) continue

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      if (matrix[rowIndex][colIndex] === -1) continue

      let spanCount = 1
      while (
        rowIndex + spanCount < totalRows &&
        props.tableData[rowIndex].nom_code ===
          props.tableData[rowIndex + spanCount].nom_code &&
        props.tableData[rowIndex][field.name] ===
          props.tableData[rowIndex + spanCount][field.name]
      ) {
        matrix[rowIndex + spanCount][colIndex] = -1
        spanCount++
      }
      matrix[rowIndex][colIndex] = spanCount
    }
  }

  return matrix
})
</script>
