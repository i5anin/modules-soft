<template>
  <div>
    <div class="date-range-filters d-flex align-items-center justify-content-start">
      <div class="d-flex align-items-center">
        <label for="start-date" class="form-label fw-bold me-2 mb-0">С</label>
        <DateRangeFilter
            id="start-date"
            class="custom-date-range-filter flex-grow-1"
            v-model="startDate"
        />
      </div>
      <div class="d-flex align-items-center ms-3">
        <label for="end-date" class="form-label fw-bold me-2 mb-0">По</label>
        <DateRangeFilter
            id="end-date"
            class="custom-date-range-filter flex-grow-1"
            v-model="endDate"
        />
      </div>
    </div>
    <OrdersTable :startDate="startDate" :endDate="endDate" />
  </div>
</template>

<script>
import DateRangeFilter from './DateRangeFilter.vue';
import OrdersTable from './OrdersTable.vue';
import {ref} from 'vue';

export default {
  components: {DateRangeFilter, OrdersTable},
  setup() {
    const startDate = ref(null);
    const endDate = ref(null);

    // Устанавливаем даты по умолчанию (3 месяца назад для "Начало" и сегодня для "Конец")
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    startDate.value = threeMonthsAgo.toISOString().split('T')[0];
    endDate.value = today.toISOString().split('T')[0];

    return {startDate, endDate};
  },
};
</script>

<style>
.date-range-filters {
  display: flex; /* Включаем flexbox разметку */
  gap: 16px; /* Добавляем отступ между фильтрами (по желанию) */
}
</style>