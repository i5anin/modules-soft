<template>
  <div
    class="date-range-filters d-flex align-items-center justify-content-start mb-3"
  >
    <div class="d-flex align-items-center">
      <label for="start-date" class="form-label fw-bold me-2 mb-0">С</label>
      <DateRangeFilter
        id="start-date"
        class="custom-date-range-filter flex-grow-1"
        v-model="localStartDate"
      />
    </div>
    <div class="d-flex align-items-center ms-3">
      <label for="end-date" class="form-label fw-bold me-2 mb-0">По</label>
      <DateRangeFilter
        id="end-date"
        class="custom-date-range-filter flex-grow-1"
        v-model="localEndDate"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import DateRangeFilter from '@/modules/shared/modules-server-side/DateRangeFilter.vue'

export default {
  components: { DateRangeFilter },
  props: {
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
  },
  emits: ['update:startDate', 'update:endDate'],
  setup(props, { emit }) {
    const localStartDate = ref(props.startDate)
    const localEndDate = ref(props.endDate)

    // Watchers для синхронизации с родительским компонентом
    watch(localStartDate, (newDate) => emit('update:startDate', newDate))
    watch(localEndDate, (newDate) => emit('update:endDate', newDate))

    return {
      localStartDate,
      localEndDate,
    }
  },
}
</script>

<style scoped>
.date-range-filters {
  display: flex;
  gap: 16px;
}
</style>
