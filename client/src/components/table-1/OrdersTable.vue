<template>
  <div>
    <DateRangeFilter/>
    <table id="ordersTable" class="table table-striped">
      <tbody/>
    </table>
  </div>
</template>

<script>
import DateRangeFilter from './../DateRangeFilter.vue';
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {getOrders} from '../../api/orders.js';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {LANG_CONFIG, ORDERS_TABLE_COLUMNS} from "./constOrdersTable.js";
import {useRouter} from 'vue-router';

export default {
  components: {DateRangeFilter},
  setup() {
    const ordersTable = ref(null);
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
        pageLength: 15,
        lengthMenu: [15, 30, 60, 100],
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

    onMounted(initializeTable);

    onBeforeUnmount(() => {
      ordersTable.value && ordersTable.value.destroy();
    });

    return {ordersTable};
  }
};
</script>