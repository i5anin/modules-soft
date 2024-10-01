<template>
  <div v-if="header" class="card mb-3">
    <div class="card-header">
      Информация о заказе
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <p class="card-text"><strong>№:</strong> {{ header.order_id }}</p>
          <p class="card-text"><strong>Дата:</strong> {{ formattedDate }}</p>
          <p class="card-text"><strong>Контрагент:</strong> {{ header.client_name }}</p>
          <p class="card-text"><strong>Срок поставки изм. инстр-та(в днях):</strong> {{ header.max_cal_buy_time }}</p>
        </div>
        <div class="col-md-6">
          <p class="card-text"><strong>Менеджер:</strong> {{ header.order_manager }}</p>
          <p class="card-text text-secondary"><strong>Контактное лицо:</strong> {{ header.contact }}</p>
          <p class="card-text text-secondary"><strong>Технический специалист:</strong> {{ header.tech_fio }}</p>
          <p class="card-text"><strong> Стоимость:</strong> {{ formattedPrice }}</p>
        </div>
      </div>
      <div v-if="header.comments" class="card mt-3">
        <div class="card-body">
          <p class="card-text"><strong>Комментарий:</strong> {{ header.comments }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formatters from "@/components/shared/formatted.js";

export default {
  props: {
    header: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedDate() {
      return formatters.formatDate(this.header.order_date);
    },
    formattedPrice() {
      return formatters.formatPrice(this.header.total_cal_price);
    },
  },
};
</script>