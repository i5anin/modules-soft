<template>
  <div>
    <table id="ordersTable" class="table table-striped">
      <thead>
      <tr>
        <th></th>
        <th>Статусы</th>
        <th>№</th>
        <th>Дата</th>
        <th class="bg-light">Контрагент</th>
        <th>Срок</th>
        <th>Менеджер</th>
      </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import {onMounted, ref, watch} from 'vue';
import {useHomeStore} from '../store/home.module';
import {getOrders} from '../api/orders';

// Импортируем стили DataTables и Bootstrap 5
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {LANGUAGE_CONFIG, ORDERS_TABLE_COLUMNS} from "../constants.js";

export default {
  setup() {
    const homeStore = useHomeStore();
    const ordersTable = ref(null);

    const initDataTable = () => {
      ordersTable.value = new DataTable('#ordersTable', {
        processing: true,
        serverSide: true,
        ajax: (data, callback, settings) => {
          const page = Math.floor(data.start / data.length) + 1;
          getOrders(page, data.length, homeStore.searchQuery)
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

    watch(() => homeStore.searchQuery, () => {
      ordersTable.value.ajax.reload();
    });

    onMounted(() => {
      initDataTable();
    });

    return {
      ordersTable,
    };
  },
};
</script>