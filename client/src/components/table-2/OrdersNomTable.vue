<template>
  <div class="container">
    <div class="mt-4 d-flex align-items-center mb-2">
      <router-link :to="{ name: 'OrdersTable' }" class="btn btn-secondary me-3">
        Назад к заказам
      </router-link>
    </div>

    <OrderInfoCard :header="header" />

    <table id="orderTable" class="table table-striped">
      <tbody/>
    </table>

    <OrderModal
        v-if="selectedOrder"
        :selectedOrder="selectedOrder"
        @close="selectedOrder = null"
    />
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import { onMounted, ref, nextTick } from 'vue';
import { getOrderById } from '../../api/orders';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import { LANG_CONFIG, ORDERS_TABLE_COLUMNS } from "./constOrderTable.js";
import { useRouter } from 'vue-router';
import OrderInfoCard from "./OrderInfoCard.vue";
import OrderModal from "../modal/modal.vue";

export default {
  components: {
    OrderInfoCard,
    OrderModal
  },
  setup() {
    const orderTable = ref(null);
    const router = useRouter();
    const nomtable = ref([]);
    const header = ref([]);
    const selectedOrder = ref(null);

    const fetchOrderData = () => {
      const orderId = router.currentRoute.value.params.orderId;
      getOrderById(orderId)
          .then(response => {
            nomtable.value = response.nomtable;
            header.value = response.header;

            nextTick(() => {
              if (!orderTable.value) {
                initializeTable();
              } else {
                orderTable.value.clear().rows.add(nomtable.value).draw();
              }
            });
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
            selectedOrder.value = data;
          });
        }
      });
    };

    onMounted(() => {
      fetchOrderData();
    });

    return {orderTable, nomtable, header, selectedOrder};
  }
};
</script>