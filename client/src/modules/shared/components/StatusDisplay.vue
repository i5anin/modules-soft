<template>
  <div class="status-display">
    <span v-for="(statusObj, index) in formattedStatuses" :key="index">
      <span
        v-if="row[statusObj.key] && row[statusObj.key].trim() !== ''"
        :class="['badge', statusObj.badgeClass]"
        >{{ row[statusObj.key] }}
      </span>
    </span>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { statuses } from '@/modules/shared/logic/statuses.js'

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
})

// Форматирование статусов, проверяя окончание ключей
const formattedStatuses = computed(() => {
  return statuses
    .map((statusObj) => {
      const rowKey = Object.keys(props.row).find((key) =>
        key.endsWith(statusObj.status)
      )
      return rowKey ? { ...statusObj, key: rowKey } : null
    })
    .filter(
      (statusObj) =>
        statusObj &&
        props.row[statusObj.key] &&
        props.row[statusObj.key].trim() !== ''
    )
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
