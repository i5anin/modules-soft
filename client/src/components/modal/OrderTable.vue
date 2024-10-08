<template>
  <div>
    <h5 class="mt-4"> {{selectedOrder.table.title}}</h5>
    <table class="table mt-3">
      <thead>
      <tr>
        <th v-for="(field, index) in fields" :key="index">
          {{ field.title }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex">
        <td v-for="(field, index) in fields" :key="index">
          {{ formatValue(row[field.name], field.name) }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatBoolean, formatDate, formatPrice, formatTime } from '@/components/shared/formatters.js';
import _ from 'lodash';

const props = defineProps({
  fields: { type: Array, required: true },
  data: { type: Array, required: true }
});

const formatValue = (value, fieldName) => {
  if (typeof value === 'boolean') {
    return formatBoolean(value);
  } else if (typeof value === 'string' && _.includes(fieldName.toLowerCase(), 'date')) {
    return formatDate(value);
  } else if (typeof value === 'string' && _.includes(fieldName.toLowerCase(), 'time')) {
    return formatTime(value);
  } else if ( _.includes(fieldName.toLowerCase(), 'price')) {
    return formatPrice(value);
  } else {
    return value;
  }
};
</script>