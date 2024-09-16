<template>
  <div class="container">
    <div class="mt-4 d-flex justify-content-between align-items-center">
      <h2>Заказ</h2>
      <router-link :to="{ name: 'OrdersTable' }" class="btn btn-secondary">Назад к заказам</router-link>
    </div>

    <OrderInfoCard :header="header"/>

    <table id="orderTable" class="table table-striped">
      <tbody/>
    </table>
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {getOrderById} from '../../api/orders';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {LANG_CONFIG, ORDERS_TABLE_COLUMNS} from "./constOrderTable.js";
import {useRouter} from 'vue-router';
import OrderInfoCard from "./OrderInfoCard.vue"

export default {
  components: {
    OrderInfoCard,
  },
  setup() {
    const orderTable = ref(null);
    const router = useRouter();
    const nomtable = ref([]);
    const header = ref([]);

    const fetchOrderData = () => {
      const orderId = router.currentRoute.value.params.orderId;
      getOrderById(orderId)
          .then(response => {
            nomtable.value = response.nomtable;
            header.value = response.header;

            if (!orderTable.value) {
              initializeTable();
            } else {
              orderTable.value.clear().rows.add(nomtable.value).draw();
            }
          })
          .catch(error => console.error('Ошибка при загрузке заказа:', error));
    };

    const initializeTable = () => {
      orderTable.value = new DataTable('#orderTable', {
        processing: true,
        searching: false,
        serverSide: false,
        data: nomtable.value,
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
      fetchOrderData();
    });

    onBeforeUnmount(() => {
      if (orderTable.value) {
        orderTable.value.destroy();
      }
    });

    return {orderTable, nomtable, header};
  }
};
</script>