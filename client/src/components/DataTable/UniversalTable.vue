<template>
  <pre>{{ info }}</pre>
  <!--  <pre>{{ fields }}</pre>-->
  <!--  <pre>{{ headers }}</pre>-->
  <!--  <pre>{{ dataTable }}</pre>-->
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
import { ref, watch } from 'vue';
import { onMounted } from 'vue';
import { defineProps, computed } from 'vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';

DataTable.use(DataTablesCore);

const props = defineProps<{
  info: object;
  fields: { name: string; title: string }[];
  dataTable: any[];
}>();

// Создание массива headers из всех name полей
const headers = ref([]);
const formattedData = ref([]);

watch(() => props.fields, (newFields) => {
  headers.value = newFields.map(field => ({ name: field.name, title: field.title }));
  formattedData.value = props.dataTable.map(row => headers.value.map(header => row[header.name] || ''));
  console.log('Headers updated:', headers.value);
  console.log('Formatted Data updated:', formattedData.value);
}, { immediate: true });



</script>


<!--надо из fields получить все name этот массив и будет headers-->
