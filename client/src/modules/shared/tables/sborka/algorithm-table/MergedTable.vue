<template>
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>#</th>
        <th v-for="(header, colIndex) in columnHeaders" :key="'th-' + colIndex">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in mergedTableData" :key="'row-' + rowIndex">
        <td
          v-if="rowSpanMap[rowIndex][0] > 0"
          :rowspan="rowSpanMap[rowIndex][0]"
        >
          {{ rowIndex + 1 }}
        </td>
        <td
          v-for="(cell, colIndex) in row"
          :key="'td-' + rowIndex + '-' + colIndex"
          :rowspan="rowSpanMap[rowIndex][colIndex]"
          :class="{ hidden: rowSpanMap[rowIndex][colIndex] === -1 }"
        >
          {{ cell !== undefined ? cell : '⚠️' }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue'
import { dataSets, tableHeaders } from './data.js'

const columnHeaders = computed(() => tableHeaders || [])

const mergedTableData = computed(() => dataSets)

const rowSpanMap = computed(() => {
  if (!dataSets.length) return []

  const rowCount = dataSets.length
  const colCount = dataSets[0].length
  const map = Array.from({ length: rowCount }, () => Array(colCount).fill(1))

  for (let col = 0; col < colCount; col++) {
    let startRow = 0
    while (startRow < rowCount) {
      let endRow = startRow
      while (
        endRow + 1 < rowCount &&
        dataSets[endRow][col] !== undefined &&
        dataSets[endRow][col] === dataSets[endRow + 1][col]
      ) {
        endRow++
      }
      if (endRow > startRow) {
        map[startRow][col] = endRow - startRow + 1
        for (let i = startRow + 1; i <= endRow; i++) {
          map[i][col] = -1
        }
      }
      startRow = endRow + 1
    }
  }
  return map
})
</script>

<style>
.table {
  text-align: center;
  vertical-align: middle;
}
.hidden {
  display: none;
}
</style>
