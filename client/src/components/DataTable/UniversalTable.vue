<template>
  <div>
    <DataTable v-if="dataLoaded" :data="formattedData" class="display" ref="tableRef" :options="dataTableOptions">
      <thead>
      <tr>
        <th v-for="(heading, index) in headers" :key="index">{{ heading.title }}</th>
      </tr>
      </thead>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

DataTable.use(DataTablesCore)

const props = defineProps({
  startDate: String,
  endDate: String,
  urlDate: Function
})

const headers = ref([])
const formattedData = ref([])
const dataLoaded = ref(false)
const tableRef = ref(null)

const dataTableOptions = ref({
  processing: true,
  serverSide: true,
  ajax: function (data, callback) {
    props.urlDate(1, 15, '', '', '', props.startDate, props.endDate).then(response => {
      const responseData = response.table
      if (responseData) {
        headers.value = responseData.fields.map(field => ({
          name: field.name,
          title: field.title || field.name
        }));
        formattedData.value = responseData.data.map(item => {
          return headers.value.map(header => item[header.name]);
        });
        callback({
          draw: data.draw,
          recordsTotal: responseData.recordsTotal,
          recordsFiltered: responseData.recordsFiltered,
          data: formattedData.value
        });
        dataLoaded.value = true
      }
    })
  },
  language: {url: 'Russian.json'},
})

const loadData = async () => {
  const response = await props.urlDate(1, 15, '', '', '', props.startDate, props.endDate)
  const responseData = response.table

  if (responseData) {
    headers.value = responseData.fields.map(field => ({
      name: field.name,
      title: field.title || field.name
    }));
    formattedData.value = responseData.data.map(item => {
      return headers.value.map(header => item[header.name]);
    });

    if (tableRef.value) {
      tableRef.value.datatable.clear().rows.add(formattedData.value).draw();
    }

    dataLoaded.value = true
  }
}

watch([() => props.startDate, () => props.endDate], loadData)
onMounted(loadData)
</script>
