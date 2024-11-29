<template>
  <div class="d-flex align-items-center gap-2">
    <input
      type="date"
      class="form-control"
      :value="formattedStartDate"
      @input="onStartDateChange($event.target.value)"
    />
    <span>до</span>
    <input
      type="date"
      class="form-control"
      :value="formattedEndDate"
      @input="onEndDateChange($event.target.value)"
    />
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import moment from 'moment'

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
      startDate.value ? moment(startDate.value).format('YYYY-MM-DD') : ''
    )
    const formattedEndDate = computed(() =>
      endDate.value ? moment(endDate.value).format('YYYY-MM-DD') : ''
    )

    const onStartDateChange = (value) => {
      const date = value ? moment(value).toDate() : null
      startDate.value = date
      emit('update:start', date)
    }

    const onEndDateChange = (value) => {
      const date = value ? moment(value).toDate() : null
      endDate.value = date
      emit('update:end', date)
    }

    // Watch for external changes to props
    watch(
      () => props.start,
      (newVal) => {
        startDate.value = moment(newVal).toDate()
      }
    )

    watch(
      () => props.end,
      (newVal) => {
        endDate.value = moment(newVal).toDate()
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
/* Стили для удобства отображения */
input[type='date'] {
  min-width: 150px;
}
</style>
