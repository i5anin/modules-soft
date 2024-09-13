<template>
  <div>
    <pre v-if="header"> {{ header }}</pre>
    <pre v-if="nomtable"> {{ nomtable }}</pre>
    <table id="orderTable" class="table table-striped">
      <tbody/>
    </table>
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {getOrderById} from '../api/orders';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {LANG_CONFIG, ORDERS_TABLE_COLUMNS} from "./constOrderTable.js";
import {useRouter} from 'vue-router';

export default {
  setup() {
    const orderTable = ref(null);
    const router = useRouter();
    const nomtable = ref([]); // Массив для данных заказов
    const header = ref([]); // Массив для данных заказов

    const fetchOrders = (callback) => {
      const orderId = router.currentRoute.value.params.orderId; // Получаем orderId
      getOrderById(orderId) // Передаем orderId как аргумент
          .then(response => {
            nomtable.value = response.nomtable;
            header.value = response.header;
            callback({
              data: response.nomtable,
              recordsTotal: response.nomtable.length, // Поправляем значение
              recordsFiltered: response.nomtable.length, // Поправляем значение
            });
          })
          .catch(error => console.error('Ошибка при загрузке заказов:', error));
    };

    const initializeTable = () => {
      orderTable.value = new DataTable('#orderTable', {
        processing: true,
        searching: false,
        serverSide: false,
        data: nomtable.value, // Используем nomtable.value вместо response.nomtable
        ajax: (data, callback) => {
          fetchOrders(data.length, null, null, callback); // Передаем правильные параметры
        },
        columns: ORDERS_TABLE_COLUMNS,
        language: LANG_CONFIG,
        createdRow: function (row, data) {
          if (data.locked) {
            $(row).find('td').css('color', '#aaaaaa');
          }
          $(row).on('click.dt', () => {
            router.push({name: 'OrderDetails', params: {orderId: data.id}});
          });
        }
      });
    };

    onMounted(() => {
      initializeTable();
    });

    onBeforeUnmount(() => {
      if (orderTable.value) {
        orderTable.value.destroy();
      }
    });

    return {orderTable, nomtable};
  }
};
</script>
