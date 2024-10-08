<template>
  <div>
    <div class="date-range-filters d-flex align-items-center justify-content-start">
      <div class="d-flex align-items-center">
        <label for="start-date" class="form-label fw-bold me-2 mb-0">С</label>
        <DateRangeFilter
            id="start-date"
            class="custom-date-range-filter flex-grow-1"
            v-model="startDate"
        />
      </div>
      <div class="d-flex align-items-center ms-3">
        <label for="end-date" class="form-label fw-bold me-2 mb-0">По</label>
        <DateRangeFilter
            id="end-date"
            class="custom-date-range-filter flex-grow-1"
            v-model="endDate"
        />
      </div>
    </div>
    <table id="ordersTable" class="table table-striped">
      <tbody>
      <tr v-if="noData">
        <td colspan="100%" class="text-center">Нет данных</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import DateRangeFilter from './DateRangeFilter.vue';
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {getOrders} from '../../api/orders.js';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {LANG_CONFIG, ORDERS_TABLE_COLUMNS} from "./constOrdersTable.js";
import {useRouter} from 'vue-router';
import _ from 'lodash'; // Импортируем Lodash

export default {
  components: {DateRangeFilter},
  setup() {
    const ordersTable = ref(null);
    const router = useRouter();
    const startDate = ref(null);
    const endDate = ref(null);
    const noData = ref(false);

    // Устанавливаем даты по умолчанию (3 месяца назад для "Начало" и сегодня для "Конец")
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    startDate.value = threeMonthsAgo.toISOString().split('T')[0];
    endDate.value = today.toISOString().split('T')[0];

    const fetchOrders = _.debounce((page, limit, searchQuery, sortCol, sortDir, callback) => {
      getOrders(page, limit, searchQuery, sortCol, sortDir, startDate.value, endDate.value)
          .then(response => {
            noData.value = response.table.data.length === 0;
            callback({
              data: response.table.data,
              recordsTotal: response.header.total_count,
              recordsFiltered: response.header.total_count,
            });
          })
          .catch(error => {
            console.error('Ошибка при загрузке заказов:', error);
            noData.value = true;
          });
    }, 300); // Оптимизация вызовов с помощью debounce

    const getColumnNameByIndex = _.memoize((index, columns) => {
      return columns[index]?.data || null;
    }); // Кэширование результатов вызова

    const initializeTable = () => {
      ordersTable.value = new DataTable('#ordersTable', {
        pageLength: 15,
        lengthMenu: [15, 30, 60, 100],
        searching: true,
        processing: true,
        serverSide: true,
        ajax: (data, callback) => {
          const page = Math.floor(data.start / data.length) + 1;
          const searchQuery = data.search.value;
          let sortCol = null;
          let sortDir = null;
          fetchOrders(page, data.length, searchQuery, sortCol, sortDir, callback);
        },
        columns: ORDERS_TABLE_COLUMNS,
        language: LANG_CONFIG,
        createdRow: (row, data) => {
          if (data.locked) {
            $(row).find('td').css('color', '#aaaaaa');
          }
          $(row).on('click.dt', _.throttle(() => {
            router.push({name: 'OrderDetails', params: {orderId: data.id}});
          }, 1000)); // Ограничение на клик через throttle
        },
        drawCallback: function () {
          noData.value = this.api().rows({filter: 'applied'}).data().length === 0;
        }
      });
    };

    onMounted(initializeTable);

    onBeforeUnmount(() => {
      ordersTable.value && ordersTable.value.destroy();
    });

    // Обновляем таблицу при изменении дат
    watch([startDate, endDate], _.debounce(() => {
      if (ordersTable.value) {
        ordersTable.value.ajax.reload();
      }
    }, 300));

    return {ordersTable, startDate, endDate, noData};
  },
};
</script>

<style>
.date-range-filters {
  display: flex; /* Включаем flexbox разметку */
  gap: 16px; /* Добавляем отступ между фильтрами (по желанию) */
}
</style>