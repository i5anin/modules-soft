<template>
  <div class="card mb-2">
    <div class="card-body p-2">
      <div class="row">
        <!-- Левый столбик: Карточка с полями leftColumnFields -->
        <div class="col-12">
          <div v-for="field in leftColumnFields" :key="field.name" class="mb-3">
            <div
              v-if="String(fieldValues[field.name]).length >= 40"
              class="form-floating"
            >
              <textarea
                v-model="fieldValues[field.name]"
                :placeholder="field.title"
                class="form-control form-control-sm"
                :style="{
                  height: calculateHeight(fieldValues[field.name]) + 'px',
                }"
                :disabled="!field.edit"
                id="floatingTextarea"
              ></textarea>
              <label :for="'floatingTextarea'">{{ field.title }}</label>
            </div>

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
              <label class="form-check-label" :for="`switch-${field.name}`">{{
                field.title
              }}</label>
            </div>

            <div v-else class="form-floating">
              <input
                type="text"
                v-model="fieldValues[field.name]"
                :placeholder="field.title"
                class="form-control form-control-sm"
                :disabled="!field.edit"
                :id="`floatingInput-${field.name}`"
              />
              <label :for="`floatingInput-${field.name}`">{{
                field.title
              }}</label>
            </div>
          </div>
        </div>

        <!-- Правый столбик: теперь снизу, отображает поля rightColumnFields -->
        <div class="col-12 mt-3">
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
                  :style="{ color: fieldValues[field.name] ? '' : '#d8d8d8' }"
                >
                  <span v-if="typeof fieldValues[field.name] !== 'boolean'">
                    {{ fieldValues[field.name] || 'Нет данных' }}
                  </span>
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
                      >{{ field.title }}</label
                    >
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
import './FormFloatingField.css'

const props = defineProps({
  leftColumnFields: Array,
  rightColumnFields: Array,
  fieldValues: Object,
})

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
