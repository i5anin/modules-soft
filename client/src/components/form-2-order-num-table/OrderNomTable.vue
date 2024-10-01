<template>
  <div class="container">
    <div class="mt-4 d-flex align-items-center mb-2">
      <router-link :to="{ name: 'OrdersTable' }" class="btn btn-secondary me-3">
        Назад к заказам
      </router-link>
    </div>

    <OrderInfoCard :header="header"/>

    <table id="orderTable" class="table table-striped">
      <tbody/>
    </table>

    <OrderModal
        :orderId="selectedOrder?.id"
        @close="selectedOrder = null"
    />
  </div>
</template>

<script setup>
import {nextTick, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {getOrderById} from '../../api/orders';
import {LANG_CONFIG, ORDERS_TABLE_COLUMNS} from './constOrderTable.js';
import OrderInfoCard from './OrderInfoCard.vue';
import OrderModal from '../modal/modal.vue';

const router = useRouter();
const orderTable = ref(null);
const nomtable = ref([]);
const header = ref([]);
const selectedOrder = ref(null);

const fetchOrderData = async () => {
  const orderId = router.currentRoute.value.params.orderId;
  try {
    const response = await getOrderById(orderId);
    nomtable.value = response.nomtable;
    header.value = response.header;
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
};

const initializeTable = () => {
  orderTable.value = new DataTable('#orderTable', {
    processing: true,
    searching: false,
    serverSide: false,
    data: nomtable.value,
    columns: ORDERS_TABLE_COLUMNS,
    language: LANG_CONFIG,
    createdRow: function (row, data) {
      if (data.locked) {
        $(row).find('td').css('color', '#aaaaaa');
      }
      $(row).on('click.dt', () => {
        console.log(`Нажата строка с ID: ${data.id}`);
        selectedOrder.value = data;
      });
    }
  });
};

onMounted(() => {
  fetchOrderData();
});
</script>