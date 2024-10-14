<template>
  <DataTable
      v-if="dataLoaded"
      :data="formattedData"
      class="display"
      :options="dataTableOptions">
    <thead>
    <tr>
      <th v-for="(field, index) in headers" :key="index">{{ field.title }}</th>
    </tr>
    </thead>
  </DataTable>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import 'datatables.net-bs5'
import axios from 'axios'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';

DataTable.use(DataTablesCore)

const props = defineProps<{
  info: object;
  fields: { name: string; title: string }[];
  apiUrl: string | null; // URL API для получения данных (должен быть указан)
  dataTable: any[];
}>()

const headers = ref([])
const formattedData = ref([])
const dataLoaded = ref(false)

if (!props.apiUrl) {
  console.error('Отсутствует обязательный prop: "apiUrl"');
}

const dataTableOptions = ref({
  processing: true,
  serverSide: true,
  ajax: (data, callback) => {
    if (!props.apiUrl) {
      console.error('Невозможно выполнить запрос: отсутствует apiUrl');
      return;
    }

    const page = Math.floor(data.start / data.length) + 1;
    const searchQuery = data.search.value;

    // Обработка сортировки
    let sortCol = null;
    let sortDir = null;
    if (data.order && data.order.length > 0) {
      const orderInfo = data.order[0];
      sortCol = data.columns[orderInfo.column].data;
      sortDir = orderInfo.dir; // 'asc' или 'desc'
    }

    // Используем axios для выполнения запроса
    axios.get(props.apiUrl, {
      params: {
        start: data.start,
        length: data.length,
        search: searchQuery,
        sortCol: sortCol,
        sortDir: sortDir
      }
    })
        .then(response => {
          const result = response.data;
          formattedData.value = props.dataTable.map(row => headers.value.map(header => row[header.name] || ''))
          callback({
            draw: data.draw,
            recordsTotal: result.recordsTotal,
            recordsFiltered: result.recordsFiltered,
            data: formattedData.value
          });
          console.log(formattedData)
        })
        .catch(error => {
          console.error('Ошибка при загрузке данных:', error);
        });
  },
  columns: props.fields.map(field => ({
    data: field.name,
    title: field.title
  })),
  language: {url: 'Russian.json'}
})

onMounted(() => {
  headers.value = props.fields.map(field => ({name: field.name, title: field.title}));
  dataLoaded.value = true;
})
</script>