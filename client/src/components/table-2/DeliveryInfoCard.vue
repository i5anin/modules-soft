<template>
  <div v-if="header" class="card mb-3">
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <p class="card-text"><strong>Срок поставки изм. инстр-та(в днях):</strong> {{ header.max_cal_buy_time }}</p>
        </div>
        <div class="col-md-6">
          <p class="card-text"><strong>Дата:</strong> {{ header.total_cal_price }}</p>
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