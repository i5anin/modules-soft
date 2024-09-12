<template>
  <div>
    <table id="ordersTable" class="table table-striped">
      <tbody />
    </table>
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { getOrders } from '../api/orders'; // Путь к вашему файлу с API
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import { LANG_CONFIG, ORDERS_TABLE_COLUMNS } from "./constOrdersTable.js";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const ordersTable = ref(null);
    const router = useRouter();

    const fetchOrders = (page, length, searchQuery, callback) => {
      getOrders(page, length, searchQuery)
          .then(response => {
            callback({
              data: response.orders,
              recordsTotal: response.totalCount,
              recordsFiltered: response.totalCount,
            });
          })
          .catch(error => console.error('Ошибка при загрузке заказов:', error));
    };

    const initializeTable = () => {
      ordersTable.value = new DataTable('#ordersTable', {
        searching: true,
        processing: true,
        serverSide: true,
        ajax: (data, callback) => {
          const page = Math.floor(data.start / data.length) + 1;
          const searchQuery = data.search.value;
          fetchOrders(page, data.length, searchQuery, callback);
        },
        columns: ORDERS_TABLE_COLUMNS,
        language: LANG_CONFIG,
        createdRow: function (row, data) {
          if (data.locked) {
            $(row).find('td').css('color', '#aaaaaa');
          }
          $(row).on('click.dt', () => {
            router.push({name: 'OrderDetails', params: {orderId: data.id}});
          });
        }
      });
    };

    onMounted(() => {
      initializeTable();
    });

    onBeforeUnmount(() => {
      if (ordersTable.value) {
        ordersTable.value.destroy();
      }
    });

    return {ordersTable};
  }
};
</script>