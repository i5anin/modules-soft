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
          <h5 class="modal-title">Редактирование поля "{{ field.title }}"</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveChanges">
            <div class="mb-3">
              <label :for="field.name" class="field-label">
                {{ field.title }}
              </label>
              <!-- Проверяем, является ли поле булевым -->
              <template v-if="isBooleanField">
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="updateData[field.name]"
                    :id="field.name"
                  />
                  <label class="form-check-label" :for="field.name">
                    {{ field.title }}
                  </label>
                </div>
              </template>
              <template v-else>
                <input
                  type="text"
                  class="form-control"
                  v-model="updateData[field.name]"
                  :id="field.name"
                />
              </template>
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

const props = defineProps({
  rowData: { type: Object, required: true },
  field: { type: Object, required: true },
})
const emit = defineEmits(['close'])

const updateData = reactive({ ...props.rowData })

const isBooleanField = computed(() => {
  return typeof updateData[props.field.name] === 'boolean'
})

const saveChanges = () => {
  // Логика сохранения изменений
  console.log('Сохраненные данные:', updateData)
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
