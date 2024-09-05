<template>
  <div>
    <table id="ordersTable" class="table table-striped">
      <tbody>
      </tbody>
    </table>
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import {onMounted, ref} from 'vue';
import {getOrders} from '../api/orders';

// Импортируем стили DataTables и Bootstrap 5
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {LANGUAGE_CONFIG, ORDERS_TABLE_COLUMNS} from "./constants.js";

export default {
  setup() {
    const ordersTable = ref(null);

    // Инициализация DataTable с встроенным поиском
    const initDataTable = () => {
      ordersTable.value = new DataTable('#ordersTable', {
        searching: true,
        processing: true,
        serverSide: true,
        ajax: (data, callback) => {
          const page = Math.floor(data.start / data.length) + 1;
          const searchQuery = data.search.value;

          // Запрос на сервер
          getOrders(page, data.length, searchQuery)
              .then(response => {
                callback({
                  data: response.orders,
                  recordsTotal: response.totalCount,
                  recordsFiltered: response.totalCount,
                });
              })
              .catch(error => {
                console.error('Ошибка при загрузке заказов:', error);
              });
        },
        columns: ORDERS_TABLE_COLUMNS,
        language: LANGUAGE_CONFIG
      });
    };

    onMounted(() => {
      initDataTable();
    });

    return {
      ordersTable,
    };
  },
};
</script>
