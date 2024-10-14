<template>
  <div>
    <DataTable v-if="!noData && formattedData.length" :data="formattedData" class="table table-striped display"
               ref="tableRef" :options="dataTableOptions" @row-clicked="handleRowClick">
      <thead>
      <tr>
        <th v-for="(heading, i) in headers" :key="i">{{ heading.title }}</th>
      </tr>
      </thead>
    </DataTable>
    <div v-else class="text-center">Нет данных</div>
  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

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
const totalCount = ref(0)

const processData = (data) => {
  headers.value = data.fields.map(f => ({name: f.name, title: f.title || f.name}))
  formattedData.value = data.data.map(item => headers.value.map(h => item[h.name]))
  noData.value = !formattedData.value.length
  if (tableRef.value && formattedData.value.length) {
    tableRef.value.datatable.clear().rows.add(formattedData.value).draw()
  }
}

const fetchData = async () => {
  if (formattedData.value.length) return
  loadRequestId++
  const currentRequestId = loadRequestId
  if (currentController) currentController.abort()
  currentController = new AbortController()
  const response = await props.urlData(1, 15, '', '', '', props.startDate, props.endDate, {signal: currentController.signal})
  totalCount.value = response.header.total_count
  if (loadRequestId === currentRequestId) processData(response.table)
}

const handleRowClick = (rowData) => {
  console.log('Нажатая позиция:', rowData)
}

const dataTableOptions = ref({
  pageLength: 15,
  lengthMenu: [15, 30, 60, 100],
  searching: true,
  processing: true,
  serverSide: true,
  ajax: async (data, callback) => {
    await fetchData()
    callback({
      draw: data.draw,
      recordsTotal: totalCount.value, // правильно отображает общее количество записей
      recordsFiltered: totalCount.value, // правильно отображает количество отфильтрованных записей
      data: formattedData.value
    })
  },
  language: {url: 'Russian.json'},
})

onMounted(fetchData)
</script>
