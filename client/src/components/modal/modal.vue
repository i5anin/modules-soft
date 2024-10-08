<template>
  <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true"
       ref="modalContainer">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderModalLabel">Детали заказа</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                  @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div v-if="selectedOrder && fields.length">
            <div v-if="selectedOrder.header">
              <h5>Дополнительные данные</h5>
              <table class="table mt-3">
                <thead>
                <tr>
                  <th v-for="(field, index) in Object.values(selectedOrder.header.fields)" :key="index">
                    {{ field.title }}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(row, rowIndex) in selectedOrder.header.data" :key="rowIndex">
                  <td v-for="(field, index) in Object.values(selectedOrder.header.fields)" :key="index">
                    {{ row[field.name] }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-if="selectedOrder.table">
              <h5>Дополнительные данные</h5>
              <table class="table mt-3">
                <thead>
                <tr>
                  <th v-for="(field, index) in Object.values(selectedOrder.table.fields)" :key="index">
                    {{ field.title }}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(row, rowIndex) in selectedOrder.table.data" :key="rowIndex">
                  <td v-for="(field, index) in Object.values(selectedOrder.table.fields)" :key="index">
                    {{ row[field.name] }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else-if="!selectedOrder">
            <p>Загрузка данных...</p>
          </div>
          <div v-else>
            <p>Нет доступных полей для отображения.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {Modal} from 'bootstrap';
import {getModalOrderById} from '@/api/orders.js';

const props = defineProps({
  orderId: {type: Number, required: true},
  fields: {type: Array, required: true}
});

const emit = defineEmits(['close']);

const modalContainer = ref(null);
let modalInstance = null;
const selectedOrder = ref(null);

onMounted(() => {
  modalInstance = new Modal(modalContainer.value);
});

watch(
    () => props.orderId,
    async (newOrderId) => {
      if (newOrderId) {
        try {
          selectedOrder.value = await getModalOrderById(newOrderId);
          modalInstance.show();
        } catch (error) {
          console.error('Ошибка при загрузке деталей заказа:', error);
          selectedOrder.value = null;
        }
      }
    },
    {immediate: true}
);

const closeModal = () => {
  modalInstance.hide();
  emit('close');
};
</script>