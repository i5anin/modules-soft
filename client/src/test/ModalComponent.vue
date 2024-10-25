<template>
  <!-- Затеняющий слой -->
  <div class="modal-backdrop fade show"></div>

  <!-- Модальное окно -->
  <div
    class="modal fade show"
    tabindex="-1"
    style="display: block"
    @click.self="closeModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <pre v-if="Object.keys(data).length">{{ formattedData }}</pre>
          <p v-else>Нет данных для отображения.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Детали записи',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const formattedData = computed(() => JSON.stringify(props.data, null, 2))
</script>

<style scoped>
.modal {
  display: block;
  z-index: 1050; /* Модальное окно выше затеняющего слоя */
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040; /* Затеняющий слой ниже модального окна */
}

.modal-dialog {
  z-index: 1050;
}
</style>
