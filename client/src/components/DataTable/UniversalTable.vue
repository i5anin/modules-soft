<template>
  <div>
    <DataTable v-if="!noData && formattedData.length > 0" :data="formattedData" class="display" ref="tableRef"
               :options="dataTableOptions">
      <thead>
      <tr>
        <th v-for="(heading, index) in headers" :key="index">{{ heading.title }}</th>
      </tr>
      </thead>
    </DataTable>
    <div v-else-if="noData" class="text-center">
      Нет данных
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';

DataTable.use(DataTablesCore)

const props = defineProps({
  startDate: String,
  endDate: String,
  urlData: Function
})

const headers = ref([])
const formattedData = ref([])
const noData = ref(false)
const tableRef = ref(null)
let loadRequestId = 0
let currentController = null

const processData = (responseData) => {
  headers.value = responseData.fields.map(field => ({
    name: field.name,
    title: field.title || field.name
  }))

  formattedData.value = responseData.data.map(item => {
    return headers.value.map(header => item[header.name])
  })

  noData.value = formattedData.value.length === 0

  if (tableRef.value && formattedData.value.length > 0) {
    tableRef.value.datatable.clear().rows.add(formattedData.value).draw()
  }
}

const fetchData = async () => {
  if (formattedData.value.length > 0) return

  loadRequestId++
  const currentRequestId = loadRequestId
  if (currentController) currentController.abort()
  currentController = new AbortController()

  try {
    const response = await props.urlData(1, 15, '', '', '', props.startDate, props.endDate, {signal: currentController.signal})
    if (currentRequestId !== loadRequestId) return
    processData(response.table)
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error(error)
    }
  }
}

const dataTableOptions = ref({
  processing: true,
  serverSide: true,
  ajax: async function (data, callback) {
    await fetchData()
    callback({
      draw: data.draw,
      recordsTotal: formattedData.value.length,
      recordsFiltered: formattedData.value.length,
      data: formattedData.value
    })
  },
  language: {url: 'Russian.json'},
})

onMounted(() => {
  fetchData()
})
</script>
