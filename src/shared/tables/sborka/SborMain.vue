<template>
  <!--  <PendingUpdatesOverlay />-->
  <div class="row">
    <div class="col-12">
      <div v-if="tableData.length === 0" class="alert alert-warning">
        Нет данных.
      </div>
      <div v-else>
        <table class="table-sbor table table-bordered table-sm table-hover">
          <thead>
            <tr style="font-size: 12px">
              <th
                v-if="isSborField"
                scope="col"
                style="width: 30px"
                title="развернуть"
              >
                <font-awesome-icon
                  :icon="['fas', 'cubes']"
                  :style="{ color: '#5a5a5a' }"
                />
              </th>
              <th
                v-if="statusField"
                scope="col"
                style="width: 30px"
                title="статусы"
                :style="{ color: '#5a5a5a' }"
              >
                🛈
              </th>
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
              v-for="(sbor, rowIndex) in tableData"
              :key="sbor.id"
              :sbor="sbor"
              :fields="filteredFields"
              :depth="0"
              :detail="detail"
              :row-index="rowIndex"
              :row-span-matrix="rowSpanMatrix"
              :status-field="statusField"
              :is-sbor-field="isSborField"
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
  import { FontAwesomeIcon } from '@/utils/icons.js'

  // Props
  const props = defineProps({
    tableData: { type: Array, required: true },
    tableFields: { type: Array, required: true },
    detail: { type: Object, required: true },
    statusField: { type: Object, required: false },
    isSborField: { type: Object, required: false },
  })

  // Фильтруем доступные поля
  const filteredFields = computed(() =>
    props.tableFields.filter(
      (field) => field.permissions.read || field.permissions.update
    )
  )

  const createMatrix = (rows, cols) =>
    Array.from({ length: rows }, () => Array(cols).fill(1))

  const shouldMergeCells = (tableData, rowIndex, spanCount, field) => {
    return (
      tableData[rowIndex].nom_code !== undefined &&
      tableData[rowIndex].nom_code ===
        tableData[rowIndex + spanCount].nom_code &&
      tableData[rowIndex][field.name] !== undefined &&
      tableData[rowIndex][field.name] ===
        tableData[rowIndex + spanCount][field.name]
    )
  }

  const mergeCellsInColumn = (matrix, tableData, field, colIndex) => {
    for (let rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
      if (matrix[rowIndex][colIndex] === -1) continue

      let spanCount = 1
      while (
        rowIndex + spanCount < tableData.length &&
        shouldMergeCells(tableData, rowIndex, spanCount, field)
      ) {
        matrix[rowIndex + spanCount][colIndex] = -1
        spanCount++
      }
      matrix[rowIndex][colIndex] = spanCount
    }
  }

  const calculateRowSpanMatrix = (tableData, filteredFields) => {
    if (!tableData.length) return []

    const matrix = createMatrix(tableData.length, filteredFields.length)

    filteredFields.forEach((field, colIndex) => {
      if (field.canMergeCells) {
        mergeCellsInColumn(matrix, tableData, field, colIndex)
      }
    })

    return matrix
  }

  const rowSpanMatrix = computed(() =>
    calculateRowSpanMatrix(props.tableData, filteredFields.value)
  )
</script>
<style>
  .table-sbor th {
    text-align: center;
    vertical-align: middle;
  }
</style>
