<template>
  <div>
    <table id="ordersTable" class="table table-striped">
      <thead>
      <tr>
        <th></th>
        <th>К</th>
        <th>И</th>
        <th>Ч</th>
        <th>М</th>
        <th>П</th>
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
import { onMounted, ref, watch } from 'vue';
import { useHomeStore } from '../store/home.module';
import { getOrders } from '../api/orders';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';

import 'datatables.net-bs5';

export default {
  setup() {
    const homeStore = useHomeStore();
    const ordersTable = ref(null); // Реактивная переменная для таблицы DataTables

    // Функция для инициализации DataTables
    const initDataTable = () => {
      ordersTable.value = new DataTable('#ordersTable', {
        processing: true, // Включаем индикатор загрузки
        serverSide: true, // Включаем серверную обработку
        ajax: (data, callback, settings) => {
          // Функция для обработки AJAX-запроса DataTables
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
        columns: [
          {
            data: 'status_ready', orderable: false, className: 'text-center',
            render: data => `<input type="checkbox" ${data ? 'checked' : ''} disabled>`
          },
          {
            data: 'status_cal', className: 'text-center',
            render: (data, type, row) => `<td class="${data ? 'table-danger' : ''} text-center">${data}</td>`
          },
          {
            data: 'status_instr', className: 'text-center',
            render: (data, type, row) => `<td class="${data ? 'table-warning' : ''} text-center">${data}</td>`
          },
          {
            data: 'status_draft', className: 'text-center',
            render: (data, type, row) => `<td class="${data ? 'table-secondary' : ''} text-center">${data}</td>`
          },
          {
            data: 'status_metall', className: 'text-center',
            render: (data, type, row) => `<td class="${data ? 'table-dark' : ''} text-center">${data}</td>`
          },
          {
            data: 'status_kp', className: 'text-center',
            render: (data, type, row) => `<td class="${data ? 'table-success' : ''} text-center">${data}</td>`
          },
          {data: 'id'},
          {data: 'date', render: data => format(new Date(data), 'dd.MM.yyyy', {locale: ru})},
          {
            data: 'name',
            render: (data, type, row) => `<td class="${row.goz ? 'table-success' : ''}">${data}</td>`
          },
          {data: 'cal_buy_time'},
          {data: 'order_manager'},
        ],
        language: { // Настройки языка для DataTables (опционально)
          url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Russian.json'
        }
      });
    };

    // Следим за изменением searchQuery для обновления таблицы
    watch(() => homeStore.searchQuery, () => {
      ordersTable.value.ajax.reload();
    });

    onMounted(() => {
      // Инициализируем DataTables после монтирования компонента
      initDataTable();
    });

    return {
      ordersTable,
    };
  },
};
</script>