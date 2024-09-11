<template>
  <div>
    <table id="ordersTable" class="table table-striped">
      <tbody/>
    </table>

    <OrderDetailsModal :order="selectedOrder" />
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import { onMounted, ref } from 'vue';
import { getOrders } from '../api/orders';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import { LANG_CONFIG, ORDERS_TABLE_COLUMNS } from "./constants.js";
import OrderDetailsModal from './OrderDetailsModal.vue';
import * as bootstrap from 'bootstrap';

export default {
  components: {
    OrderDetailsModal
  },
  setup() {
    const ordersTable = ref(null);
    const selectedOrder = ref(null);
    let detailsModal = null;

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
        createdRow: function (row, data, dataIndex) {
          if (data.locked) {
            $(row)
                .find('td')
                .css('color', '#aaaaaa');
          }
          $(row).on('click.dt', () => { // Используем пространство имен .dt
            selectedOrder.value = data;
            detailsModal.show();
          });
        }
      });
    };

    onMounted(() => {
      detailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
      initializeTable();
    });

    return { ordersTable, selectedOrder };
  },
};
</script>