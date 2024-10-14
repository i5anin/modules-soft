<template>
  <div>
    dataLoaded = {{ dataLoaded }}
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
import {defineProps, onMounted, ref, watch} from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {_} from 'lodash'

DataTable.use(DataTablesCore)

const props = defineProps({
  startDate: String,
  endDate: String,
  urlData: Function
})

const headers = ref([])
const formattedData = ref([])
const dataLoaded = ref(false);
const tableRef = ref(null)
let loadRequestId = 0; // Флаг для отмены старых запросов
let isLoading = false;  // Флаг для предотвращения многократных запросов

const dataTableOptions = ref({
  processing: true,
  serverSide: true,
  ajax: async function (data, callback) {
    if (isLoading) {
      console.log('Запрос уже в процессе загрузки, отмена повторного запроса.');
      return;
    }
    isLoading = true; // Устанавливаем флаг, чтобы предотвратить повторные запросы
    loadRequestId++;
    const currentRequestId = loadRequestId;
    console.log('Начало загрузки данных через ajax...');
    try {
      const response = await props.urlData(1, 15, '', '', '', props.startDate, props.endDate);
      if (currentRequestId !== loadRequestId) {
        console.log('Отменен устаревший запрос.');
        isLoading = false;
        return;
      }
      console.log('Данные получены через ajax:', response);
      const responseData = response.table;
      if (responseData) {
        headers.value = responseData.fields.map(field => ({
          name: field.name,
          title: field.title || field.name
        }));
        console.log('Заголовки таблицы:', JSON.parse(JSON.stringify(headers.value)));
        formattedData.value = responseData.data.map(item => {
          return headers.value.map(header => item[header.name]);
        });
        console.log('Отформатированные данные:', JSON.parse(JSON.stringify(formattedData.value)));
        callback({
          draw: data.draw,
          recordsTotal: responseData.recordsTotal,
          recordsFiltered: responseData.recordsFiltered,
          data: formattedData.value
        });
        dataLoaded.value = true;
        console.log('Данные успешно загружены и обработаны.');
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных через ajax:', error);
    } finally {
      isLoading = false; // Разблокируем загрузку
    }
  },
  language: {url: 'Russian.json'},
});


const loadData = async () => {
  if (isLoading) {
    console.log('Запрос уже в процессе загрузки, отмена повторного запроса.');
    return;
  }
  isLoading = true; // Устанавливаем флаг, чтобы предотвратить повторные запросы
  loadRequestId++;
  const currentRequestId = loadRequestId;
  console.log('Начало загрузки данных...');
  dataLoaded.value = false;
  try {
    const response = await props.urlData(1, 15, '', '', '', props.startDate, props.endDate);
    if (currentRequestId !== loadRequestId) {
      console.log('Отменен устаревший запрос.');
      isLoading = false;
      return;
    }
    console.log('Данные получены:', response);
    const responseData = response.table;

    if (responseData) {
      headers.value = responseData.fields.map(field => ({
        name: field.name,
        title: field.title || field.name
      }));
      console.log('Заголовки таблицы:', JSON.parse(JSON.stringify(headers.value)));
      formattedData.value = responseData.data.map(item => {
        return headers.value.map(header => item[header.name]);
      });
      console.log('Отформатированные данные:', JSON.parse(JSON.stringify(formattedData.value)));

      if (tableRef.value) {
        console.log('Обновление данных в таблице...');
        tableRef.value.datatable.clear().rows.add(formattedData.value).draw();
      }

      dataLoaded.value = true;
      console.log('Данные успешно загружены и обновлены.');
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  } finally {
    isLoading = false; // Разблокируем загрузку
  }
}

const debouncedLoadData = _.debounce(loadData, 2000); // Увеличена задержка до 2000 мс для предотвращения частых вызовов

// watch([() => props.startDate, () => props.endDate], debouncedLoadData);

onMounted(() => {
  console.log('Компонент смонтирован, начинаем загрузку данных...');
  loadData();
})
</script>
