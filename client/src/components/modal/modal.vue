<template>
  <div class="modal fade"
       id="orderModal"
       tabindex="-1"
       aria-labelledby="orderModalLabel"
       aria-hidden="true"
       ref="modalContainer">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderModalLabel">Детали заказа</h5>
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  @click="closeModal">
          </button>
        </div>
        <div class="modal-body">
          <p v-if="selectedOrder">
            <strong>ID:</strong> {{ selectedOrder.id }}
          </p>
        </div>
        <div class="modal-footer">
          <button type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  @click="closeModal">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {Modal} from 'bootstrap';

const props = defineProps({
  selectedOrder: {
    type: Object,
    default: () => null
  },
});

const emit = defineEmits(['close']);

const modalContainer = ref(null);
let modalInstance = null;

onMounted(() => {
  if (modalContainer.value) {
    modalInstance = new Modal(modalContainer.value);
  }
});

watch(
    () => props.selectedOrder,
    (newVal) => {
      if (newVal && modalInstance) {
        console.log(`Модальное окно открыто для заказа с ID: ${newVal.id}`);
        modalInstance.show();
      }
    }
);

const closeModal = () => {
  if (modalInstance) {
    console.log(`Модальное окно закрыто для заказа с ID: ${props.selectedOrder.id}`);
    modalInstance.hide();
  }
  emit('close');
};
</script>