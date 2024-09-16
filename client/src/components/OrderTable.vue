<template>
  <div>
<!--    <pre v-if="header"> {{ header }}</pre>-->
    <div v-if="header" class="card mb-3">
      <div class="card-header">
        Информация о заказе
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <p class="card-text"><strong>№:</strong> {{ header.order_id }}</p>
            <p class="card-text"><strong>Дата:</strong> {{ header.order_date }}</p>
            <p class="card-text"><strong>Контрагент:</strong> {{ header.client_name }}</p>
          </div>
          <div class="col-md-6">
            <p class="card-text"><strong>Менеджер:</strong> {{ header.order_manager }}</p>
            <p class="card-text">? <strong>Контактное лицо:</strong> {{ header.contact }}</p>
            <p class="card-text">? <strong>Технический специалист:</strong> {{ header.tech_fio }}</p>
          </div>
        </div>
        <div class="card"> <div class="col-md-12">  <p class="card-body"><strong>Комментарий:</strong> {{ header.comments }}</p> </div>
        </div>
      </div>
    </div>

    <!--    <pre v-if="nomtable"> {{ nomtable }}</pre>-->
    <table id="orderTable" class="table table-striped">
      <tbody/>
    </table>

    <div v-if="header" class="card mb-3">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <p class="card-text"><strong>Срок поставки изм. инстр-та(в днях):</strong> {{ header.max_cal_buy_time }}</p>
          </div>
          <div class="col-md-6">
            <p class="card-text"><strong>Дата:</strong> {{ header.total_cal_price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataTable from 'datatables.net-dt';
import $ from 'jquery';
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {getOrderById} from '../api/orders'; // Путь к вашему API
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-bs5';
import {LANG_CONFIG, ORDERS_TABLE_COLUMNS} from "./constOrderTable.js";
import {useRouter} from 'vue-router';

export default {
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