<template>
  <div class="d-flex me-3">
    <div class="d-flex">
      <label for="start-date" class="form-label fw-bold me-2 mb-0">
        Диапазон:
      </label>
      <DateInput
        id="start-date"
        :modelValue="start"
        @update:modelValue="updateStart"
      />
    </div>
    <div class="d-flex align-items-center ms-3">
      <label for="end-date" class="form-label fw-bold me-2 mb-0"></label>
      <DateInput
        id="end-date"
        :modelValue="end"
        @update:modelValue="updateEnd"
      />
    </div>
  </div>
</template>

<script>
import DateInput from './DateInput.vue'

export default {
  components: { DateInput },
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
