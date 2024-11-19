<template>
  <div
    class="date-range-filters d-flex align-items-center justify-content-start mb-3"
  >
    <div class="d-flex align-items-center">
      <label for="start-date" class="form-label fw-bold me-2 mb-0"
        >Диапазон:</label
      >
      <DateRangeFilter id="start-date" :value="start" @input="updateStart" />
    </div>
    <div class="d-flex align-items-center ms-3">
      <label for="end-date" class="form-label fw-bold me-2 mb-0">-</label>
      <DateRangeFilter id="end-date" :value="end" @input="updateEnd" />
    </div>
  </div>
</template>

<script>
import DateRangeFilter from '@/modules/shared/modules-server-side/DateRangeFilter.vue'

export default {
  components: { DateRangeFilter },
  props: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  emits: ['update:start', 'update:end', 'date-range-change'],
  methods: {
    updateStart(value) {
      this.$emit('update:start', value)
      this.$emit('date-range-change', { start: value, end: this.end })
    },
    updateEnd(value) {
      this.$emit('update:end', value)
      this.$emit('date-range-change', { start: this.start, end: value })
    },
  },
}
</script>
