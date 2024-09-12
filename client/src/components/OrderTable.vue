<template>
  <div>
    <table id="orderTable" class="table table-striped">
      <tbody />
    </table>
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import { onMounted, ref, onBeforeUnmount, computed } from 'vue';
import { getOrderById } from '../api/orders';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import { LANG_CONFIG, ORDERS_TABLE_COLUMNS } from "./constOrderTable.js";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const orderTable = ref(null);
    const router = useRouter();
    const orderId = useRoute().params.orderId; // Получаем orderId из маршрута
    const orderData = ref(null); // Хранение данных заказа

    const fetchOrders = (page, length, searchQuery, callback) => {
      // Передаем orderId в getOrderById
      getOrderById(orderId, searchQuery)
          .then(response => {
            orderData.value = response; // Сохраняем данные заказа
            callback({
              data: response.nomtable,
              recordsTotal: response.nomtable.length,
              recordsFiltered: response.nomtable.length,
            });
          })
          .catch(error => console.error('Ошибка при загрузке заказа:', error));
    };

    const initializeTable = () => {
      orderTable.value = new DataTable('#orderTable', {
        searching: true,
        processing: true,
        serverSide: false, // Отключаем serverSide, так как данные уже получены
        data: orderData.value ? orderData.value.nomtable : [], // Используем данные из orderData.value.nomtable
        columns: ORDERS_TABLE_COLUMNS,
        language: LANG_CONFIG,
        createdRow: function (row, data) {
          if (data.locked) {
            $(row).find('td').css('color', '#aaaaaa');
          }
          $(row).on('click.dt', () => {
            router.push({ name: 'OrderDetails', params: { orderId: data.id } });
          });
        }
      });
    };

    onMounted(() => {
      fetchOrders(1, 10, '', () => { // Загружаем данные при монтировании
        initializeTable();
      });
    });

    onBeforeUnmount(() => {
      if (orderTable.value) {
        orderTable.value.destroy();
      }
    });

    return { orderTable };
  }
};
</script>