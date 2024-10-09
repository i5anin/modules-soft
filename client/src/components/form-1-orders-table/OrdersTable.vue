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
      <thead>
      <tr>
        <th v-for="field in tableFields" :key="field.name">{{ field.title }}</th>
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
import {LANG_CONFIG} from "./constOrdersTable.js";
import {useRouter} from 'vue-router';

const statuses = [
  {status: 'ordersnom__status_cal', badgeClass: 'bg-danger', label: 'К'},
  {status: 'ordersnom__status_instr', badgeClass: 'bg-warning', label: 'И'},
  {status: 'ordersnom__status_draft', badgeClass: 'bg-secondary', label: 'Ч'},
  {status: 'ordersnom__status_metall', badgeClass: 'bg-dark', label: 'М'},
  {status: 'ordersnom__status_kp', badgeClass: 'bg-success', label: 'КП'}
];

export default {
  components: {DateRangeFilter},
  setup() {
    const ordersTable = ref(null);
    const router = useRouter();
    const startDate = ref(null);
    const endDate = ref(null);
    const noData = ref(false);
    const tableFields = ref([]);

    const orderTable = ref(null);
    const nomtable = ref([]);
    const header = ref([]);
    const selectedOrder = ref(null);

    // Устанавливаем даты по умолчанию (3 месяца назад для "Начало" и сегодня для "Конец")
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    startDate.value = threeMonthsAgo.toISOString().split('T')[0];
    endDate.value = today.toISOString().split('T')[0];

    const fetchOrders = async (page, limit, searchQuery, sortCol, sortDir, callback) => {
      try {
        const response = await getOrders(page, limit, searchQuery, sortCol, sortDir, startDate.value, endDate.value);
        noData.value = response.table.data.length === 0;
        tableFields.value = response.table.fields; // Сохраняем поля таблицы
        nomtable.value = response.table.data; // Сохраняем данные для отображения в таблице

        if (ordersTable.value) {
          ordersTable.value.clear().rows.add(response.table.data).draw(); // Обновляем таблицу DataTable
        }

        callback({
          data: response.table.data,
          recordsTotal: response.header.total_count,
          recordsFiltered: response.header.total_count,
        });
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        noData.value = true;
      }
    };

    const renderStatus = (row) => {
      return statuses.map(status => {
        const value = row[status.status];
        return value ? `<span class="badge ${status.badgeClass}">${status.label}</span>` : '';
      }).join(' ');
    };

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
        columns: tableFields.value.map(field => ({
          data: field.name,
          title: field.title,
          render: statuses.some(status => status.status === field.name) ? (data, type, row) => renderStatus(row) : null
        })),
        language: LANG_CONFIG,
        createdRow: (row, data) => {
          if (data.locked) {
            $(row).find('td').css('color', '#aaaaaa');
          }
          $(row).on('click.dt', () => {
            router.push({name: 'OrderDetails', params: {orderId: data.id}});
          });
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
    watch([startDate, endDate], () => {
      if (ordersTable.value) {
        ordersTable.value.ajax.reload();
      }
    });

    return {ordersTable, startDate, endDate, noData, tableFields};
  },
};
</script>

<style>
.date-range-filters {
  display: flex; /* Включаем flexbox разметку */
  gap: 16px; /* Добавляем отступ между фильтрами (по желанию) */
}
</style>