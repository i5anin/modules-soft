<template>
  <div class="container">
    <div class="mt-4 d-flex align-items-center mb-2">
      <router-link :to="{ name: 'OrdersTable' }" class="btn btn-secondary me-3">
        Назад к заказам
      </router-link>
    </div>

    <OrderInfoCard :header="header"/>

    <table id="orderTable" class="table table-striped">
      <thead>
      <tr>
        <th v-for="field in filteredTableFields" :key="field.name">{{ field.title }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in nomtable" :key="row.ordersnom_id">
        <td v-for="field in filteredTableFields" :key="field.name">
          <span v-if="field.name === 'statuses'" v-html="renderStatus(row)"></span>
          <span v-else>{{ row[field.name] }}</span>
        </td>
      </tr>
      </tbody>
    </table>
    <OrderModal
        :orderId="selectedOrder?.ordersnom_id"
        :fields="tableFields"
        @close="selectedOrder = null"
    />
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {getOrderById} from '../../api/orders';
import OrderInfoCard from './OrderInfo.vue';
import OrderModal from '../modal/Modal.vue';
import _ from 'lodash'; // Импортируем Lodash

const router = useRouter();
const orderTable = ref(null);
const nomtable = ref([]);
const header = ref([]);
const selectedOrder = ref(null);
const tableFields = ref([]);

const fetchOrderData = _.debounce(async () => {
  const orderId = router.currentRoute.value.params.orderId;
  try {
    const response = await getOrderById(orderId);
    nomtable.value = response.table.data;
    header.value = response.header;
    tableFields.value = response.table.fields;
    nextTick(() => {
      if (!orderTable.value) {
        initializeTable();
      } else {
        orderTable.value.clear().rows.add(nomtable.value).draw();
      }
    });
  } catch (error) {
    console.error('Ошибка при загрузке заказа:', error);
  }
}, 300); // Оптимизация вызовов с помощью debounce

const initializeTable = _.once(() => {
  orderTable.value = new DataTable('#orderTable', {
    processing: true,
    searching: false,
    serverSide: false,
    data: nomtable.value,
    columns: filteredTableFields.value.map(field => ({
      data: field.name,
      title: field.name === 'statuses' ? 'Статусы' : field.title,
      className: field.name === 'statuses' ? 'text-center' : '',
      render: field.name === 'statuses' ? (data, type, row) => renderStatus(row) : null
    })),
    language: {url: 'Russian.json'},
    createdRow: function (row, data) {
      if (data.locked) {
        $(row).find('td').css('color', '#aaaaaa');
      }
      $(row).on('click.dt', _.throttle(() => {
        console.log(`Нажата строка с ID: ${data.ordersnom_id}`);
        selectedOrder.value = data;
      }, 1000)); // Ограничение на клик через throttle
    }
  });
});

const filteredTableFields = computed(() => {
  const fields = _.filter(tableFields.value, field =>
      !field.name.startsWith('status_') && field.name !== 'ordersnom_id'
  );
  fields.unshift({name: 'statuses', title: 'Статусы'}); // Добавляем "statuses" в начало массива
  return fields;
});

const statuses = [
  {status: 'cal', badgeClass: 'bg-danger', label: 'К'},
  {status: 'instr', badgeClass: 'bg-warning', label: 'И'},
  {status: 'draft', badgeClass: 'bg-secondary', label: 'Ч'},
  {status: 'metall', badgeClass: 'bg-dark', label: 'М'},
  {status: 'kp', badgeClass: 'bg-success', label: 'КП'}
];

const renderStatus = _.memoize((row) => {
  const activeStatuses = _.filter(statuses, s => row[`status_${s.status}`] && row[`status_${s.status}`].trim() !== '');

  if (activeStatuses.length > 0) {
    return activeStatuses
        .map(s => `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`)
        .join('');
  } else {
    return '';
  }
});

onMounted(() => {
  fetchOrderData();
});
</script>