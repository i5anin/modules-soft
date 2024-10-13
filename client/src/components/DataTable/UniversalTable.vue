<template>
  <pre>{{ info }}</pre>
<!--  <pre>{{ fields }}</pre>-->
<!--  <pre>{{ headers }}</pre>-->
<!--  <pre>{{ dataTable }}</pre>-->
  <DataTable :data="dataTable" class="display">
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

watch(() => props.fields, (newFields) => {
  headers.value = newFields.map(field => field.name);
  console.log('Headers updated:', headers.value);
}, { immediate: true });
onMounted(() => {
  console.log('Headers:', headers.value);
});

watch(() => props.fields, (newFields) => {
  console.log('Fields updated:', newFields);
}, { immediate: true });
</script>


<!--надо из fields получить все name этот массив и будет headers-->
