<template>
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>#</th>
        <th v-for="(header, index) in tableHeaders" :key="index">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in dataSets" :key="rowIndex">
        <td
          v-if="rowSpanMatrix[rowIndex][0] > 0"
          :rowspan="rowSpanMatrix[rowIndex][0]"
        >
          {{ rowIndex + 1 }}
        </td>
        <td
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          v-show="rowSpanMatrix[rowIndex][colIndex] !== -1"
          :rowspan="rowSpanMatrix[rowIndex][colIndex]"
        >
          {{ cell ?? '⚠️' }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue'
import { dataSets, tableHeaders } from './data.js'

const rowSpanMatrix = computed(() => {
  if (!dataSets.length) return []

  const totalRows = dataSets.length // Общее количество строк
  const totalCols = dataSets[0].length // Общее количество колонок

  // Матрица объединений ячеек (rowspan)
  const matrix = Array.from({ length: totalRows }, () =>
    Array(totalCols).fill(1)
  )

  for (let colIndex = 0; colIndex < totalCols; colIndex++) {
    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      if (matrix[rowIndex][colIndex] === -1) continue

      let spanCount = 1
      while (
        rowIndex + spanCount < totalRows &&
        dataSets[rowIndex][colIndex] ===
          dataSets[rowIndex + spanCount][colIndex]
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

<style>
.table {
  text-align: center;
  vertical-align: middle;
}
</style>
