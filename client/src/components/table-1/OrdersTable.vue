<template>
  <div>
    <div class="row mb-3">
      <div class="col-md-3">
        <label for="startDate" class="form-label">Дата начала:</label>
        <input type="text" class="form-control datepicker" id="startDate" ref="startDateRef">
      </div>
      <div class="col-md-3">
        <label for="endDate" class="form-label">Дата окончания:</label>
        <input type="text" class="form-control datepicker" id="endDate" ref="endDateRef">
      </div>
    </div>

    <table id="ordersTable" class="table table-striped">
      <tbody/>
    </table>
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {getOrders} from '../../api/orders.js';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {LANG_CONFIG, ORDERS_TABLE_COLUMNS} from "./constOrdersTable.js";
import {useRouter} from 'vue-router';

export default {
  setup() {
    const ordersTable = ref(null);
    const startDateRef = ref(null);
    const endDateRef = ref(null);
    const router = useRouter();

    const fetchOrders = (page, limit, searchQuery, sortBy, sortDir, callback) => {
      getOrders(page, limit, searchQuery, sortBy, sortDir)
          .then(response => callback({
            data: response.orders,
            recordsTotal: response.totalCount,
            recordsFiltered: response.totalCount,
          }))
          .catch(error => console.error('Ошибка при загрузке заказов:', error));
    };

    const initializeTable = () => {
      ordersTable.value = new DataTable('#ordersTable', {
        searching: true,
        processing: true,
        serverSide: true,
        ajax: (data, callback) => {
          const page = Math.floor(data.start / data.length) + 1; // data.length здесь работает корректно
          const {value: searchQuery} = data.search;
          let sortBy;
          let sortDir;
          fetchOrders(page, data.length, searchQuery, sortBy, sortDir, callback);
        },
        columns: ORDERS_TABLE_COLUMNS,
        language: LANG_CONFIG,
        createdRow: (row, data) => {
          if (data.locked) {
            $(row).find('td').css('color', '#aaaaaa');
          }
          $(row).on('click.dt', () => {
            router.push({name: 'OrderDetails', params: {orderId: data.id}});
          });
        }
      });
    };

    const initializeDatepicker = () => {
      $(startDateRef.value).datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
        language: 'ru',
        weekStart: 1
      });

      $(endDateRef.value).datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
        language: 'ru',
        weekStart: 1
      });
    };

    onMounted(() => {
      initializeTable();
      initializeDatepicker();
    });

    onBeforeUnmount(() => {
      ordersTable.value && ordersTable.value.destroy();
      $(startDateRef.value).datepicker('destroy');
      $(endDateRef.value).datepicker('destroy');
    });

    return {ordersTable, startDateRef, endDateRef};
  }
};
</script>