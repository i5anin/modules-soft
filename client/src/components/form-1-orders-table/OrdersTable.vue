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
      <tr v-if="noData">
        <td colspan="100%" class="text-center">Нет данных</td>
      </tr>
      <tr v-for="row in orders" :key="row.id">
        <td v-for="field in tableFields" :key="field.name">
          <span v-if="field.name.startsWith('ordersnom__status_')" v-html="renderStatus(row, field.name)"></span>
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
    const orders = ref([]);
    const tableFields = ref([]);

    // Устанавливаем даты по умолчанию (3 месяца назад для "Начало" и сегодня для "Конец")
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    startDate.value = threeMonthsAgo.toISOString().split('T')[0];
    endDate.value = today.toISOString().split('T')[0];

    const statuses = [
      {status: 'ordersnom__status_cal', badgeClass: 'bg-danger', label: 'К'},
      {status: 'ordersnom__status_instr', badgeClass: 'bg-warning', label: 'И'},
      {status: 'ordersnom__status_draft', badgeClass: 'bg-secondary', label: 'Ч'},
      {status: 'ordersnom__status_metall', badgeClass: 'bg-dark', label: 'М'},
      {status: 'ordersnom__status_kp', badgeClass: 'bg-success', label: 'КП'}
    ];

    const fetchOrders = (page, limit, searchQuery, sortCol, sortDir, callback) => {
      getOrders(page, limit, searchQuery, sortCol, sortDir, startDate.value, endDate.value)
          .then(response => {
            noData.value = response.table.data.length === 0;
            orders.value = response.table.data;
            tableFields.value = response.table.fields;
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
    }

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
          className: field.name.startsWith('ordersnom__status_') ? 'text-center' : '',
          render: field.name.startsWith('ordersnom__status_') ? (data, type, row) => renderStatus(row, field.name) : null
        })),
        language: {url: 'Russian.json'},
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

    const renderStatus = (row, fieldName) => {
      const status = statuses.find(s => s.status === fieldName);
      if (row[fieldName] && row[fieldName].trim() !== '') {
        return `<span class="badge ${status.badgeClass}">${status.label}</span>`;
      } else {
        return '';
      }
    };

    onMounted(() => {
      fetchOrders(1, 15, '', null, null, () => {
        initializeTable();
      });
    });

    onBeforeUnmount(() => {
      ordersTable.value && ordersTable.value.destroy();
    });

    // Обновляем таблицу при изменении дат
    watch([startDate, endDate], () => {
      if (ordersTable.value) {
        ordersTable.value.ajax.reload();
      }
    });

    return {ordersTable, startDate, endDate, noData, orders, tableFields, renderStatus};
  },
};
</script>

<style>
.date-range-filters {
  display: flex; /* Включаем flexbox разметку */
  gap: 16px; /* Добавляем отступ между фильтрами (по желанию) */
}
</style>

<style>
.date-range-filters {
  display: flex; /* Включаем flexbox разметку */
  gap: 16px; /* Добавляем отступ между фильтрами (по желанию) */
}
</style>

<style>
.date-range-filters {
  display: flex; /* Включаем flexbox разметку */
  gap: 16px; /* Добавляем отступ между фильтрами (по желанию) */
}
</style>