<template>
  <pre>{{ info }}</pre>
  <DataTable :data="formattedData" class="display">
    <thead>
    <tr>
      <th v-for="(field, index) in headers" :key="index">{{ field.title }}</th>
    </tr>
    </thead>
  </DataTable>
  <pre>{{ headers }}</pre>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'

DataTable.use(DataTablesCore)

const props = defineProps<{
  info: object;
  fields: { name: string; title: string }[];
  dataTable: any[];
}>()

// Создание массива headers из всех name полей
const headers = ref([])
const formattedData = ref([])

const updateTableData = () => {
  headers.value = props.fields.map(field => ({ name: field.name, title: field.title }))
  formattedData.value = props.dataTable.map(row => headers.value.map(header => row[header.name] || ''))

  console.log('Обновлены заголовки:', headers.value)
  console.log('Обновлены отформатированные данные:', formattedData.value)
}

onMounted(() => {
  updateTableData()
})
</script>
