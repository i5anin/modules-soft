<template>
  <DataTable :data="data" class="display" :options="options">
    <thead>
    <tr>
      <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
    </tr>
    </thead>
  </DataTable>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';

DataTable.use(DataTablesCore);

const props = defineProps<{
  headers: string[];
  data: any[][];
  options: object;
}>();
</script>
