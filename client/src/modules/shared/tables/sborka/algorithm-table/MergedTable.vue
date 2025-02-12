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
          v-if="rowSpanMap[rowIndex][0] > 0"
          :rowspan="rowSpanMap[rowIndex][0]"
        >
          {{ rowIndex + 1 }}
        </td>
        <td
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          v-show="rowSpanMap[rowIndex][colIndex] !== -1"
          :rowspan="rowSpanMap[rowIndex][colIndex]"
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

const rowSpanMap = computed(() => {
  if (!dataSets.length) return []

  const rowCount = dataSets.length
  const colCount = dataSets[0].length
  const map = Array.from({ length: rowCount }, () => Array(colCount).fill(1))

  for (let col = 0; col < colCount; col++) {
    for (let row = 0; row < rowCount; row++) {
      if (map[row][col] === -1) continue
      let span = 1
      while (
        row + span < rowCount &&
        dataSets[row][col] === dataSets[row + span][col]
      ) {
        map[row + span][col] = -1
        span++
      }
      map[row][col] = span
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
</style>
