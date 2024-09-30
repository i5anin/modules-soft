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
          <div v-if="selectedOrder">
            <p v-for="(value, key) in filteredOrder" :key="key">
              <strong>{{ key }}:</strong> {{ value }}
            </p>
          </div>
          <div v-else>
            <p>Загрузка данных...</p>
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
import {computed, onMounted, ref, watch} from 'vue';
import {Modal} from 'bootstrap';
import {getModalOrderById} from '../../api/orders';

const props = defineProps({
  orderId: {type: Number, required: true}
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
        selectedOrder.value = await getModalOrderById(newOrderId);
        modalInstance.show();
      }
    },
    {immediate: true}
);

const closeModal = () => {
  modalInstance.hide();
  emit('close');
};

const filteredOrder = computed(() => {
  const {recalc, ...rest} = selectedOrder.value || {};
  return rest;
});
</script>