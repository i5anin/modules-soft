<template>
  <DataTable
      v-if="dataLoaded"
      :data="formattedData"
      class="display"
      :options="dataTableOptions"
  >
    <thead>
    <tr>
      <th v-for="(field, index) in headers" :key="index">{{ field.title }}</th>
    </tr>
    </thead>
  </DataTable>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue'
import axios from 'axios'

import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

DataTable.use(DataTablesCore)

const props = defineProps<{
  startDate: string;
  endDate: string;
  url: string;
}>();

const headers = ref(props.fields.map(field => ({name: field.name, title: field.title})))
const formattedData = ref([])
const dataLoaded = ref(false) // Состояние для контроля загрузки данных

const dataTableOptions = ref({
  processing: true,
  serverSide: true,
  ajax: async (data, callback) => {
    try {
      const response = await [url](1, 15, '', null, null, startDate.value, endDate.value)

      const responseData = response.data
      formattedData.value = responseData.data

      callback({
        draw: responseData.draw,
        recordsTotal: responseData.recordsTotal,
        recordsFiltered: responseData.recordsFiltered,
        data: formattedData.value
      })

      dataLoaded.value = true
    } catch (error) {
      console.error('Ошибка при загрузке данных с сервера:', error)
    }
  },
  columns: props.fields.map(field => ({
    data: field.name,
    title: field.title
  })),
  language: {url: 'Russian.json'}
})

onMounted(() => {
  dataLoaded.value = true
})
</script>
