
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
          <!-- ... other content ... -->
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
import { Modal } from 'bootstrap';

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
      // Initialize the modal immediately
      modalInstance = new Modal(modalContainer.value);

      // Show the modal when selectedOrder prop changes
      watch(() => props.selectedOrder, (newVal) => {
        if (newVal) {
          modalInstance.show();
        }
      });
    });

    const closeModal = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
      emit('close');
    };

    return { closeModal, modalContainer };
  }
};
</script>