<template>
  <div>
    <div class="field-label">{{ field.title }}</div>
    <div class="field-value" :style="{ color: value ? '' : '#d8d8d8' }">
      <span v-if="!isBoolean">{{ value || 'Нет данных' }}</span>
      <div v-else class="form-check form-switch d-inline-block me-3">
        <input
          type="checkbox"
          :checked="value"
          class="form-check-input"
          :id="`switch-${field.name}`"
          disabled
        />
        <label class="form-check-label" :for="`switch-${field.name}`">
          {{ field.title }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import type { Field } from '../../types'

const props = defineProps<{
  field: Field
  value: string | boolean | number
}>()

const isBoolean = computed(() => typeof props.value === 'boolean')
</script>

<style scoped>
.field-label {
  font-size: 0.8rem;
  color: #212529;
  font-weight: 600;
}

.field-value {
  font-size: 1rem;
  color: #495057;
}
</style>
