<template>
  <table
    :class="[
      'table',
      'table-bordered',
      'table-sm',
      'table-hover',
      'table-sbor',
      'mb-0',
      'align-middle',
    ]"
  >
    <thead>
      <tr>
        <th
          v-for="n in columnCount"
          :key="'head-' + n"
          class="text-center align-middle"
          style="height: 32px"
        >
          <span class="placeholder-glow w-100 d-block">
            <span class="placeholder bg-secondary col-10 rounded"></span>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rowCount" :key="'row-' + row">
        <td
          v-for="col in columnCount"
          :key="'cell-' + row + '-' + col"
          class="text-center align-middle"
          style="height: 28px"
        >
          <span class="placeholder-wave w-100 d-block">
            <span class="placeholder bg-secondary col-9 rounded"></span>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
  defineProps({
    columnCount: {
      type: Number,
      default: 1,
    },
    rowCount: {
      type: Number,
      default: 10,
    },
  })
</script>
