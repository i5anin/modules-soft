<template>
  <div class="card mb-2">
    <div class="card-body p-2">
      <div class="row">
        <div class="col-md-6">
          <table class="table table-sm border-light">
            <tbody>
              <tr v-for="field in leftColumnFields" :key="field.name">
                <td class="p-1">{{ field.title }}</td>
                <td class="p-1" width="40%">
                  <textarea
                    v-if="String(fieldValues[field.name]).length >= 25"
                    v-model="fieldValues[field.name]"
                    :placeholder="field.title"
                    class="form-control form-control-sm"
                    :style="{
                      height: calculateHeight(fieldValues[field.name]) + 'px',
                    }"
                    :disabled="!field.edit"
                  />
                  <div
                    v-else-if="typeof fieldValues[field.name] === 'boolean'"
                    class="form-check form-switch"
                  >
                    <input
                      type="checkbox"
                      v-model="fieldValues[field.name]"
                      class="form-check-input"
                      :id="`switch-${field.name}`"
                      :disabled="!field.edit"
                    />
                    <label
                      class="form-check-label"
                      :for="`switch-${field.name}`"
                    />
                  </div>
                  <input
                    v-else
                    type="text"
                    v-model="fieldValues[field.name]"
                    :placeholder="field.title"
                    class="form-control form-control-sm"
                    :disabled="!field.edit"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="col-md-6">
          <div class="card-body p-2">
            <div class="row g-3">
              <div
                v-for="field in rightColumnFields"
                :key="field.name"
                class="col-md-6"
              >
                <div class="field-label">{{ field.title }}</div>
                <div
                  class="field-value"
                  :style="{
                    color: fieldValues[field.name] ? '' : '#d8d8d8',
                  }"
                >
                  <span v-if="typeof fieldValues[field.name] !== 'boolean'">{{
                    fieldValues[field.name] || 'Нет данных'
                  }}</span>
                  <div
                    v-else-if="typeof fieldValues[field.name] === 'boolean'"
                    class="form-check form-switch"
                  >
                    <input
                      type="checkbox"
                      v-model="fieldValues[field.name]"
                      class="form-check-input"
                      :id="`switch-${field.name}`"
                      :disabled="!field.edit"
                    />
                    <label
                      class="form-check-label"
                      :for="`switch-${field.name}`"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue' // добавлен computed

const props = defineProps({
  leftColumnFields: Array,
  rightColumnFields: Array,
  fieldValues: Object,
})

function calculateHeight(text) {
  const lineHeight = 21 // высота строки
  const padding = 10 // дополнительное пространство для более точного отображения
  const lineCount = Math.ceil(text.length / 25) // примерное число строк на основе длины текста
  return lineCount * lineHeight + padding
}
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
