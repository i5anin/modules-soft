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

<script>
import { ref, onMounted, nextTick } from 'vue';
import { Modal } from 'bootstrap'; // Import Bootstrap Modal

export default {
  props: {
    selectedOrder: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const modalContainer = ref(null);
    let modalInstance = null;

    onMounted(() => {
      nextTick(() => { // Ждём завершения обновления DOM
        const modalEl = modalContainer.value;
        modalInstance = new Modal(modalEl, {
          backdrop: true, // Ensure backdrop is set to true or 'static' as needed
          keyboard: true // Ensure keyboard interaction is enabled
        });
        modalInstance.show();
      });
    });

    const closeModal = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
      emit('close');
    };

    return { closeModal };
  }
};
</script>