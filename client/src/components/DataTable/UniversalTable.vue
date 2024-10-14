<template>
  <DataTable
    v-if="dataLoaded"
    :data="formattedData"
    class="display">
    <thead>
    <tr>
      <th v-for="(field, index) in headers" :key="index">{{ field.title }}</th>
    </tr>
    </thead>
  </DataTable>
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

const headers = ref([])
const formattedData = ref([])
const dataLoaded = ref(false) // Состояние для контроля загрузки данных

const updateTableData = () => {
  headers.value = props.fields.map(field => ({ name: field.name, title: field.title }))
  formattedData.value = props.dataTable.map(row => headers.value.map(header => row[header.name] || ''))

  console.log('Обновлены заголовки:', headers.value)
  console.log('Обновлены отформатированные данные:', formattedData.value)

  // Устанавливаем флаг после форматирования данных
  dataLoaded.value = true
}

onMounted(() => {
  updateTableData()
})
</script>
