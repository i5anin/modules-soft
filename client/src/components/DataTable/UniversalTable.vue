<template>
  <div>
    <!-- Отображаем заголовки и форматированные данные для отладки -->
    <p>Headers: {{ headers[0] }}</p>
    <p>Formatted Data: {{ dataLoaded }}</p>

    <DataTable
        v-if="dataLoaded"
        :data="formattedData"
        class="display"
        ref="tableRef"
    >
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
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

DataTable.use(DataTablesCore)

const props = defineProps<{
  startDate: string | null;
  endDate: string | null;
  url: Function;
}>()

const headers = ref([]) // Динамически определяем заголовки
const formattedData = ref([])
const dataLoaded = ref(false)
const tableRef = ref(null) // Реф для доступа к таблице

const loadData = async () => {
  try {
    const response = await props.url(1, 10, '', '', '', props.startDate, props.endDate)

    if (!response || !response.table || !response.table.data || !response.table.fields) {
      throw new Error('Некорректный ответ от сервера или отсутствует свойство "table"')
    }

    const responseData = response.table

    // Устанавливаем данные для таблицы
    formattedData.value = responseData.data || []

    // Получаем заголовки из responseData.fields
    headers.value = responseData.fields.map(field => ({
      name: field.name,
      title: field.title || field.name
    }))

    // После загрузки данных вручную обновляем таблицу
    const table = tableRef.value?.datatable
    if (table) {
      table.clear()
      table.rows.add(formattedData.value).draw()
    }

    dataLoaded.value = true
  } catch (error) {
    console.error('Ошибка при загрузке данных с сервера:', error)
  }
}

watch([() => props.startDate, () => props.endDate], loadData)

onMounted(loadData)
</script>
