<template>
  <div>
<!--    <div class="row mb-3">-->
<!--      <div class="col-md-3">-->
<!--        <input type="text" class="form-control" placeholder="Поиск..." v-model="searchQuery">-->
<!--      </div>-->
<!--      <div class="col-md-2">-->
<!--        <select class="form-select" v-model="selectedStatus">-->
<!--          <option value="">Все статусы</option>-->
<!--          <option value="К">К</option>-->
<!--          <option value="И">И</option>-->
<!--          <option value="Ч">Ч</option>-->
<!--          <option value="М">М</option>-->
<!--          <option value="КП">КП</option>-->
<!--        </select>-->
<!--      </div>-->
<!--      <div class="col-md-2">-->
<!--        <input type="date" class="form-control" v-model="startDate">-->
<!--      </div>-->
<!--      <div class="col-md-2">-->
<!--        <input type="date" class="form-control" v-model="endDate">-->
<!--      </div>-->
<!--      <div class="col-md-3">-->
<!--        <button class="btn btn-primary" @click="applyFilters">Применить</button>-->
<!--      </div>-->
<!--    </div>-->
    <table id="ordersTable" class="table table-striped">
      <tbody>
      </tbody>
    </table>
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import { onMounted, ref, watch } from 'vue';
import { useHomeStore } from '../store/home.module';
import { getOrders } from '../api/orders';

// Импортируем стили DataTables и Bootstrap 5
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import { LANGUAGE_CONFIG, ORDERS_TABLE_COLUMNS } from "../constants.js";

export default {
  setup() {
    const homeStore = useHomeStore();
    const ordersTable = ref(null);

    const searchQuery = ref(homeStore.searchQuery);
    const selectedStatus = ref('');
    const startDate = ref('');
    const endDate = ref('');

    const initDataTable = () => {
      ordersTable.value = new DataTable('#ordersTable', {
        processing: true,
        serverSide: true,
        ajax: (data, callback, settings) => {
          const page = Math.floor(data.start / data.length) + 1;

          getOrders(page, data.length, searchQuery.value, selectedStatus.value, startDate.value, endDate.value)
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

    watch([searchQuery, selectedStatus, startDate, endDate], () => {
      ordersTable.value.ajax.reload();
    });

    const applyFilters = () => {
      ordersTable.value.ajax.reload();
    };

    onMounted(() => {
      initDataTable();
    });

    return {
      ordersTable,
      searchQuery,
      selectedStatus,
      startDate,
      endDate,
      applyFilters
    };
  },
};
</script>