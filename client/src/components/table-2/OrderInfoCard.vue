<template>
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
      <div class="card">
        <div class="col-md-12">
          <p class="card-body"><strong>Комментарий:</strong> {{ header.comments }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: Object,
      required: true
    }
  }
}
</script>