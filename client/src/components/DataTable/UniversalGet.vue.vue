<template>
  <div class="container-fluid ">
    <div class="row">
      <div class="col-12">
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
        <DataTable
            :columns="columns"
            :options="{ select: true }"
            :ajax="{ url: '/data.json', dataSrc: 'data' }"
            class="display"
            width="100%"
        />
        <!-- <UniversalTable></UniversalTable>-->
      </div>
    </div>
  </div>
</template>

<script>
import DateRangeFilter from '../form-1-orders-table/DateRangeFilter.vue';
import $ from 'jquery';
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {getOrders} from '../../api/orders.js';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {useRouter} from 'vue-router';
import _ from 'lodash';
import {formatBoolean, formatDate, formatPrice, formatTime} from "@/components/shared/formatters.js";
import DataTable from "@/components/DataTable/DataTable.vue";

export default {
  components: {DataTable, DateRangeFilter},
  setup() {
    const ordersTable = ref(null);
    const router = useRouter();
    const startDate = ref(null);
    const endDate = ref(null);
    const noData = ref(false);
    const orders = ref([]);
    const tableFields = ref([]);
    const totalCount = ref(0); // Добавляем переменную для хранения total_count

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

    const fetchOrders = (page, limit, searchQuery, sortCol, sortDir) => {
      return getOrders(page, limit, searchQuery, sortCol, sortDir, startDate.value, endDate.value)
          .then(response => {
            noData.value = response.table.data.length === 0;
            orders.value = response.table.data.map(order => {
              // Форматируем каждое поле перед сохранением в состояние
              const formattedOrder = {};
              tableFields.value.forEach(field => {
                formattedOrder[field.name] = formatValue(order[field.name], field.name);
              });
              return formattedOrder;
            });
            tableFields.value = response.table.fields;
            totalCount.value = response.header.total_count; // Обновляем total_count
          })
          .catch(error => {
            console.error('Ошибка при загрузке заказов:', error);
            noData.value = true;
          });
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
          fetchOrders(page, data.length, searchQuery, sortCol, sortDir).then(() => {
            callback({
              data: orders.value,
              recordsTotal: totalCount.value,
              recordsFiltered: totalCount.value,
            });
          });
        },
        columns: filteredTableFields.value.map(field => ({
          data: field.name,
          title: field.name === 'statuses' ? 'Статусы' : field.title,
          className: field.name === 'statuses' ? 'text-center' : '',
          render: field.name === 'statuses' ? (data, type, row) => renderStatus(row) :
              field.name === 'clients__name' ? (data, type, row) => `<span style="${row.goz ? 'background-color: lightgreen;' : ''}">${data || ''}</span>` : null
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

    const filteredTableFields = computed(() => {
      const fields = _.filter(tableFields.value, field =>
          !field.name.startsWith('ordersnom__status_') && field.name !== 'id' && field.name !== 'goz'
      );
      fields.splice(1, 0, {name: 'statuses', title: 'Статусы'});
      // Переименовываем столбец status_ready в пустую строку
      fields.forEach(field => {
        if (field.name === 'status_ready') field.title = '';
      });
      return fields;
    });

    const renderStatus = _.memoize((row) => {
      const activeStatuses = _.filter(statuses, s => row[s.status] && row[s.status].trim() !== '');

      if (activeStatuses.length > 0) {
        return activeStatuses
            .map(s => `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`)
            .join('');
      } else {
        return '';
      }
    });

    const formatValue = (value, fieldName) => {
      if (typeof value === 'boolean' && fieldName !== 'goz') {
        // console.log(fieldName)
        return formatBoolean(value); // выдает '✅' : '❌'
      } else if (typeof value === 'string' && _.includes(fieldName, 'date')) {
        return formatDate(value);
      } else if (typeof value === 'number' && _.includes(fieldName, 'time')) {
        return formatTime(value);
      } else if (typeof value === 'string' && _.includes(fieldName, 'price')) {
        return formatPrice(value);
      }
      return value;
    };

    onMounted(() => {
      // Сначала загружаем данные, потом инициализируем таблицу
      fetchOrders(1, 15, '', null, null).then(() => {
        console.log("fetchOrders completed");
        initializeTable();
      });
    });

    onBeforeUnmount(() => {
      ordersTable.value && ordersTable.value.destroy();
    });

    // Обновляем таблицу при изменении дат
    watch([startDate, endDate], () => {
      if (ordersTable.value) {
        ordersTable.value.ajax.reload(null, false);
      }
    });

    return {
      ordersTable,
      startDate,
      endDate,
      noData,
      orders,
      tableFields,
      renderStatus,
      filteredTableFields,
      formatValue
    };
  },
};
</script>

<style>
.date-range-filters {
  display: flex; /* Включаем flexbox разметку */
  gap: 16px; /* Добавляем отступ между фильтрами (по желанию) */
}
</style>

