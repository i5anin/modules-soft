<template>
  <table id="ordersTable" class="table table-striped">
    <thead>
    <tr>
      <th v-for="field in filteredTableFields" :key="field.name">{{ field.title }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="noData">
      <td colspan="100%" class="text-center">Нет данных</td>
    </tr>
    <tr v-for="row in orders" :key="row.id">
      <td v-for="field in filteredTableFields" :key="field.name">
        <span v-if="field.name === 'statuses'" v-html="renderStatus(row)"></span>
        <span v-else-if="field.name === 'clients__name'"
              :style="{ backgroundColor: row.goz ? 'lightgreen' : '' }">
          {{ formatValue(row[field.name], field.name) }}
        </span>
        <span v-else>{{ formatValue(row[field.name], field.name) }}</span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import {formatBoolean, formatDate, formatPrice, formatTime} from '@/components/shared/formatters.js';
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {getOrders} from '../../api/orders.js';
import _ from 'lodash';
import {useRouter} from 'vue-router';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';

const formatValue = (value, fieldName) => {
  if (typeof value === 'boolean') {
    return formatBoolean(value);
  } else if (typeof value === 'string' && _.includes(fieldName, 'date')) {
    return formatDate(value);
  } else if (typeof value === 'string' && _.includes(fieldName, 'time')) {
    return formatTime(value);
  } else if (typeof value === ('string' || 'number') && _.includes(fieldName, 'price')) {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) return formatPrice(numericValue);
  }
  return value;
};

export default {
  methods: { formatValue},
  props: {
    startDate: {
      type: String,
      required: true,
      default: ''
    },
    endDate: {
      type: String,
      required: true
    },
    orderId: {
      type: Number,
      required: false,
      default: null
    }
  },
  setup(props) {
    const ordersTable = ref(null);
    const router = useRouter();
    const noData = ref(false);
    const orders = ref([]);
    const tableFields = ref([]);

    const statuses = [
      {status: 'ordersnom__status_cal', badgeClass: 'bg-danger', label: 'К'},
      {status: 'ordersnom__status_instr', badgeClass: 'bg-warning', label: 'И'},
      {status: 'ordersnom__status_draft', badgeClass: 'bg-secondary', label: 'Ч'},
      {status: 'ordersnom__status_metall', badgeClass: 'bg-dark', label: 'М'},
      {status: 'ordersnom__status_kp', badgeClass: 'bg-success', label: 'КП'}
    ];

    const fetchOrders = (page, limit, searchQuery, sortCol, sortDir, callback) => {
      getOrders(page, limit, searchQuery, sortCol, sortDir, props.startDate, props.endDate)
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
        if (field.name === 'status_ready') {
          field.title = '';
        }
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

    onMounted(() => {
      fetchOrders(1, 15, '', null, null, () => {
        initializeTable();
      });
    });

    onBeforeUnmount(() => {
      ordersTable.value && ordersTable.value.destroy();
    });

    // Обновляем таблицу при изменении дат
    watch(() => [props.startDate, props.endDate], () => {
      if (ordersTable.value) {
        ordersTable.value.ajax.reload();
      }
    });

    return {ordersTable, noData, orders, tableFields, renderStatus, filteredTableFields};
  },
};
</script>