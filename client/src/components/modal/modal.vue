<template>
  <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderModalLabel">Детали заказа</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p><strong>ID:</strong> {{ selectedOrder.id }}</p>
          <p><strong>Название:</strong> {{ selectedOrder.name }}</p>
          <p><strong>Описание:</strong> {{ selectedOrder.description }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    selectedOrder: {
      type: Object,
      required: true
    }
  },
  setup() {
    const selectedOrder = ref({});

    const showModal = () => {
      const modal = new bootstrap.Modal(document.getElementById('orderModal'));
      modal.show();
    };

    return {selectedOrder, showModal};
  }
};
</script>

<style scoped>
/* Добавьте стили для модального окна, если необходимо */
</style>