<!--StatusDisplay.vue-->
<template>
  <div class="status-display">
    <span v-for="(statusObj, index) in formattedStatuses" :key="index">
      <span
        v-if="row[statusObj.status] && row[statusObj.status].trim() !== ''"
        :class="['badge', statusObj.badgeClass]"
        >{{ row[statusObj.status] }}
      </span>
    </span>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { statuses } from '@/modules/shared/statuses.js'

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
})

// Форматирование статусов, возвращая только те, которые содержат непустые значения
const formattedStatuses = computed(() => {
  return statuses.filter((statusObj) => {
    const statusValue = props.row[statusObj.status]
    return statusValue && statusValue.trim() !== ''
  })
})
</script>

<style scoped>
.status-display {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.badge {
  padding: 5px;
  border-radius: 4px;
}
</style>
