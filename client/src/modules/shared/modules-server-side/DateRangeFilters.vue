<template>
  <div class="d-flex me-3">
    <div class="d-flex">
      <label for="start-date" class="form-label fw-bold me-2 mb-0">
        Диапазон:
      </label>
      <DateRangeFilter
        id="start-date"
        :value="tableStore.startDate"
        @input="updateStart"
      />
    </div>
    <div class="d-flex align-items-center ms-3">
      <label for="end-date" class="form-label fw-bold me-2 mb-0"></label>
      <DateRangeFilter
        id="end-date"
        :value="tableStore.endDate"
        @input="updateEnd"
      />
    </div>
  </div>
</template>

<script>
import { useServerSideTableStore } from '../server-side-table/stores/serverSideTable.js'
import DateRangeFilter from '@/modules/shared/modules-server-side/DateInput.vue'

export default {
  components: { DateRangeFilter },
  setup(_, { emit }) {
    const tableStore = useServerSideTableStore()

    const updateStart = (value) => {
      tableStore.setDateRange(value, tableStore.endDate)
      emit('date-range-change', { start: value, end: tableStore.endDate })
    }

    const updateEnd = (value) => {
      tableStore.setDateRange(tableStore.startDate, value)
      emit('date-range-change', { start: tableStore.startDate, end: value })
    }

    return {
      tableStore,
      updateStart,
      updateEnd,
    }
  },
}
</script>
