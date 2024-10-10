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
import {onMounted, ref, watch} from 'vue';
import {Modal} from 'bootstrap';

export default {
  props: {
    selectedOrder: {
      type: Object,
      required: true,
    },
  },
  setup(props, {emit}) {
    const modalContainer = ref(null);
    let modalInstance = null;

    onMounted(() => {
      console.log('Modal component mounted'); // Debugging

      // Check if modalContainer is available
      if (modalContainer.value) {
        modalInstance = new Modal(modalContainer.value);
        console.log('Modal instance created', modalInstance); // Debugging
      } else {
        console.error('Modal container not found!');
      }

      // Watch for changes in selectedOrder
      watch(
          () => props.selectedOrder,
          (newVal) => {
            console.log('selectedOrder changed:', newVal); // Debugging
            if (newVal && modalInstance) {
              modalInstance.show();
            }
          }
      );
    });

    const closeModal = () => {
      if (modalInstance) {
        modalInstance.hide();
      }
      emit('close');
    };

    return {closeModal, modalContainer};
  },
};
</script>