<template>
  <div class="card mb-2">
    <div class="card-body p-2">
      <div class="row">
        <!-- Левый столбик: Карточка с полями editableFormFields -->
        <div class="col-12">
          <div
            v-for="field in editableFormFields"
            :key="field.name"
            class="mb-3"
          >
            <div
              v-if="String(localFieldValues[field.name]).length >= 40"
              class="form-floating"
            >
              <textarea
                v-model="localFieldValues[field.name]"
                :placeholder="field.title"
                class="form-control form-control-sm"
                :style="{
                  height: calculateHeight(localFieldValues[field.name]) + 'px',
                }"
                :disabled="!field.edit"
                :id="`floatingTextarea-${field.name}`"
              ></textarea>
              <label :for="`floatingTextarea-${field.name}`">
                {{ field.title }}
              </label>
            </div>

            <div v-else-if="typeof localFieldValues[field.name] === 'boolean'">
              <div class="form-check form-switch d-inline-block me-3">
                <input
                  type="checkbox"
                  v-model="localFieldValues[field.name]"
                  class="form-check-input"
                  :id="`switch-${field.name}`"
                  :disabled="!field.edit"
                />
                <label class="form-check-label" :for="`switch-${field.name}`">
                  {{ field.title }}
                </label>
              </div>
            </div>

            <div v-else class="form-floating">
              <input
                type="text"
                v-model="localFieldValues[field.name]"
                :placeholder="field.title"
                class="form-control form-control-sm"
                :disabled="!field.edit"
                :id="`floatingInput-${field.name}`"
              />
              <label :for="`floatingInput-${field.name}`">
                {{ field.title }}
              </label>
            </div>
          </div>
        </div>

        <!-- Правый столбик: отображает поля readonlyFormFields в 2 ряда -->
        <div class="col-12 mt-3">
          <div class="card-body p-2">
            <div class="row g-3">
              <div
                class="col-md-6"
                v-for="field in readonlyFormFields"
                :key="field.name"
              >
                <div class="field-label">{{ field.title }}</div>
                <div
                  class="field-value"
                  :style="{
                    color: localFieldValues[field.name] ? '' : '#d8d8d8',
                  }"
                >
                  <span
                    v-if="typeof localFieldValues[field.name] !== 'boolean'"
                  >
                    {{ localFieldValues[field.name] || 'Нет данных' }}
                  </span>
                  <div
                    v-else
                    class="form-check form-switch d-inline-block me-3"
                  >
                    <input
                      type="checkbox"
                      v-model="localFieldValues[field.name]"
                      class="form-check-input"
                      :id="`switch-${field.name}`"
                      :disabled="!field.edit"
                    />
                    <label
                      class="form-check-label"
                      :for="`switch-${field.name}`"
                    >
                      {{ field.title }}
                    </label>
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
import { defineProps, ref } from 'vue'
import { formatValueCard } from '@/utils/formatters.ts' // Импортируйте вашу функцию форматирования
import '@/assets/FormFloatingField.css'

const props = defineProps({
  editableFormFields: Array,
  readonlyFormFields: Array,
  fieldValues: Object,
})

// Создаем локальную реактивную копию fieldValues с форматированием
const localFieldValues = ref(computeFormattedValues(props.fieldValues))

function computeFormattedValues(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      formatValueCard(value, key), // Применяем форматирование к каждому значению
    ])
  )
}

function calculateHeight(text) {
  const lineHeight = 21
  const padding = 10
  const lineCount = Math.ceil(text.length / 25)
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
