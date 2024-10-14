<template>
  <div>
    <!-- Отображаем заголовки и форматированные данные для отладки -->
    <p>Headers: {{ headers[0] }}</p>
    <p>Formatted Data: {{ dataLoaded }}</p>

    <div v-for="(heading, index) in headers" :key="index">
      {{ heading.title}}
    </div>
<!-- выводит заголовки, но ниже это не работает -->
<!--    status_ready-->
<!--    К-->
<!--    И-->
<!--    Ч-->
<!--    М-->
<!--    КП-->
<!--    № заказа-->
<!--    Дата заказа-->
<!--    Контрагент-->
<!--    Срок закупки МС-->
<!--    Менеджер-->
<!--    Цена калибров в заказе-->
<!--    Комментарий заказа-->
<!--    ГосОборонЗаказ-->

    <DataTable
        v-if="dataLoaded"
        :data="formattedData"
        class="display"
        :options="dataTableOptions"
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

const dataTableOptions = ref({
  processing: true,
  serverSide: true,
  ajax: async (data, callback) => {
    try {
      const response = await props.url(
          data.start / data.length + 1, // current page
          data.length, // page size
          data.search.value, // search query
          data.order[0]?.column, // order column
          data.order[0]?.dir, // order direction
          props.startDate, // start date filter
          props.endDate // end date filter
      )

      // Проверяем наличие свойства 'table' в ответе
      if (!response || !response.table || !response.table.data || !response.table.fields) {
        throw new Error('Некорректный ответ от сервера или отсутствует свойство "table"')
      }

      const responseData = response.table

      // Устанавливаем данные для таблицы
      // formattedData.value = responseData.data || []

      // Получаем заголовки из responseData.fields
      headers.value = responseData.fields.map(field => ({
        name: field.name,
        title: field.title || field.name // Используем либо заголовок, либо имя поля
      }))

      // Передаем данные для DataTable
      callback({
        draw: data.draw,
        recordsTotal: responseData.recordsTotal || formattedData.value.length,
        recordsFiltered: responseData.recordsFiltered || formattedData.value.length,
        data: formattedData.value
      })

      dataLoaded.value = true
    } catch (error) {
      console.error('Ошибка при загрузке данных с сервера:', error)
    }
  }
,
  columns: headers.value.map(field => ({
    data: field.name,
    title: field.title
  })),
  language: { url: 'Russian.json' }
})

watch([() => props.startDate, () => props.endDate], () => {
  dataLoaded.value = false // перезагрузить данные при изменении даты
  setTimeout(() => {
    dataLoaded.value = true
  }, 0)
})

onMounted(() => {
  dataLoaded.value = true
})
</script>
