<template>
  <div
    class="modal"
    tabindex="-1"
    role="dialog"
    style="display: block; background: rgba(0, 0, 0, 0.6)"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Детали строки</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveChanges">
            <div v-for="field in editableFields" :key="field.name" class="mb-3">
              <label :for="field.name" class="field-label">
                {{ field.title }}
              </label>
              <input
                type="text"
                class="form-control"
                v-model="editableData[field.name]"
                :id="field.name"
              />
            </div>
            <div v-for="field in readonlyFields" :key="field.name" class="mb-3">
              <label :for="field.name" class="field-label">
                {{ field.title }}
              </label>
              <input
                type="text"
                class="form-control"
                :value="formatValueCard(editableData[field.name], field.name)"
                :id="field.name"
                disabled
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Закрыть
          </button>
          <button type="button" class="btn btn-primary" @click="saveChanges">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { formatValueCard } from '@/utils/formatters.js'
import '@/assets/FormFloatingField.css'

const props = defineProps({
  rowData: { type: Object, required: true },
  fields: { type: Array, required: true },
})
const emit = defineEmits(['close'])

const editableData = reactive({ ...props.rowData })

const editableFields = computed(() => {
  return props.fields.filter((field) => field.edit)
})

const readonlyFields = computed(() => {
  return props.fields.filter((field) => !field.edit)
})

const saveChanges = () => {
  console.log('Сохраненные данные:', editableData)
  emit('close')
}
</script>

<style scoped>
.modal {
  display: block;
}

.modal-dialog {
  max-width: 500px;
}

.modal-content {
  position: relative;
}
</style>
