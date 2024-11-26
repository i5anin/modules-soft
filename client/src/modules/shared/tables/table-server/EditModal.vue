<template>
  <div
    v-if="visible"
    class="modal fade show"
    tabindex="-1"
    role="dialog"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
        </div>
        <div class="modal-body">
          <div v-for="(value, key) in headersMap" :key="key" class="mb-3">
            <label :for="key" class="form-label">
              {{ headersMap[key] || key }}
            </label>
            <input
              type="text"
              class="form-control"
              :id="key"
              v-model="editableRow[key]"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="saveChanges">
            Save changes
          </button>
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, watch } from 'vue'

export default {
  name: 'EditModal',
  props: {
    title: {
      type: String,
      default: 'Edit Row',
    },
    visible: {
      type: Boolean,
      required: true,
    },
    row: {
      type: Object,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    // Создаем реактивную копию строки для редактирования
    const editableRow = reactive({ ...props.row })

    // Маппинг заголовков (имя -> заголовок)
    const headersMap = computed(() =>
      props.headers.reduce((map, header) => {
        map[header.name] = header.title || header.name
        return map
      }, {})
    )

    // Следим за изменением `row` и обновляем `editableRow`
    watch(
      () => props.row,
      (newRow) => {
        Object.assign(editableRow, newRow)
      }
    )

    // Закрыть модальное окно
    const closeModal = () => {
      emit('close')
    }

    // Сохранить изменения
    const saveChanges = () => {
      emit('save', { ...editableRow })
    }

    return {
      editableRow,
      headersMap,
      closeModal,
      saveChanges,
    }
  },
}
</script>

<style scoped>
.modal.fade.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  margin: 10% auto;
}
</style>
