<template>
  <div class="date-range-filters">
    <input
      type="date"
      :value="formattedStartDate"
      @input="onStartDateChange($event.target.value)"
    />
    <span> - </span>
    <input
      type="date"
      :value="formattedEndDate"
      @input="onEndDateChange($event.target.value)"
    />
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'

export default {
  name: 'DateRangeFilters',
  props: {
    start: {
      type: Date,
      default: () => new Date(new Date().setMonth(new Date().getMonth() - 3)),
    },
    end: { type: Date, default: () => new Date() },
  },
  emits: ['update:start', 'update:end'],
  setup(props, { emit }) {
    const startDate = ref(props.start)
    const endDate = ref(props.end)

    const formattedStartDate = computed(() =>
      startDate.value ? startDate.value.toISOString().split('T')[0] : ''
    )
    const formattedEndDate = computed(() =>
      endDate.value ? endDate.value.toISOString().split('T')[0] : ''
    )

    const onStartDateChange = (value) => {
      const date = value ? new Date(value) : null
      startDate.value = date
      emit('update:start', date)
    }

    const onEndDateChange = (value) => {
      const date = value ? new Date(value) : null
      endDate.value = date
      emit('update:end', date)
    }

    // Watch for external changes to props
    watch(
      () => props.start,
      (newVal) => {
        startDate.value = new Date(newVal)
      }
    )

    watch(
      () => props.end,
      (newVal) => {
        endDate.value = new Date(newVal)
      }
    )

    return {
      startDate,
      endDate,
      formattedStartDate,
      formattedEndDate,
      onStartDateChange,
      onEndDateChange,
    }
  },
}
</script>

<style scoped>
.date-range-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

input[type='date'] {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
