// OrderDetailsModal.vue
<template>
  <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderDetailsModalLabel">Детали заказа</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>
        <div class="modal-body">
          <p>ID заказа: {{ order?.id }}</p>
          <p>Контрагент: {{ order?.name }}</p>
          <p>Дата: {{ order?.date }}</p>
          <!-- Добавьте другие поля заказа по мере необходимости -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: Object
  }
};
</script>