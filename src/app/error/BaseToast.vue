<template>
  <div
    v-if="toastStore.isVisible"
    class="toast-container position-fixed top-0 end-0 p-3"
    style="z-index: 1100"
  >
    <div
      class="toast show text-white border-0 shadow"
      :class="toastClass"
      role="alert"
    >
      <div class="d-flex align-items-center">
        <div class="toast-icon px-3 fs-4">
          <i :class="iconClass"></i>
        </div>

        <div class="toast-body">
          <strong class="d-block fs-6">{{ title }}</strong>
          <span class="small">{{ toastStore.message }}</span>
        </div>

        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="Закрыть"
          @click="toastStore.hide"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useToastStore } from '@/app/error/store.js'

  const toastStore = useToastStore()

  /**
   * Возвращает заголовок в зависимости от типа уведомления
   */
  const title = computed(() => {
    switch (toastStore.type) {
      case 'success':
        return 'Успешно'
      case 'warning':
        return 'Предупреждение'
      case 'info':
        return 'Информация'
      case 'danger':
      default:
        return 'Ошибка сервера'
    }
  })

  /**
   * Bootstrap классы по типу уведомления
   */
  const toastClass = computed(() => ({
    'bg-danger': toastStore.type === 'danger',
    'bg-success': toastStore.type === 'success',
    'bg-warning': toastStore.type === 'warning',
    'bg-info': toastStore.type === 'info',
  }))

  /**
   * Bootstrap Icons по типу уведомления
   */
  const iconClass = computed(() => {
    switch (toastStore.type) {
      case 'success':
        return 'bi bi-check-circle-fill'
      case 'warning':
        return 'bi bi-exclamation-triangle-fill'
      case 'info':
        return 'bi bi-info-circle-fill'
      case 'danger':
      default:
        return 'bi bi-exclamation-octagon-fill'
    }
  })
</script>

<style scoped>
  .toast {
    min-width: 320px;
    max-width: 380px;
    border-radius: 0.5rem;
  }

  .toast-icon {
    display: flex;
    align-items: center;
  }
</style>
