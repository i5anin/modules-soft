<template>
  <div class="alert alert-info info-overlay" role="alert">
    <div class="info-content">
      <div>
        <strong>Изменённые данные:</strong>
        <ul>
          <li
            v-for="update in tableStore.pendingUpdates"
            :key="update.updateKey"
          >
            <pre>{{ update }}</pre>
            <span>
              <strong>ID:</strong> {{ update.id }} <strong>Таблица:</strong>
              {{ update.updateTable }} <strong>Поле:</strong>
              {{ update.fieldName }} <strong>Стало:</strong>
              {{ update.newValue }}
            </span>
          </li>
        </ul>
      </div>
      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-success btn-sm"
          @click="confirmUpdates"
        >
          Подтвердить
        </button>
        <button type="button" class="btn btn-danger btn-sm"> Отменить </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { useTableStore } from './tableStore'

  export default {
    name: 'InfoOverlay',
    setup() {
      const tableStore = useTableStore()

      const confirmUpdates = async () => {
        try {
          await tableStore.confirmUpdates()
        } catch (error) {
          console.error('Ошибка подтверждения:', error)
        }
      }

      return {
        tableStore,
        confirmUpdates,
      }
    },
  }
</script>

<style scoped>
  .alert {
    font-size: 1rem;
    padding: 1rem;
    border-radius: 0.25rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .info-overlay {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1050;
    max-width: 500px;
  }

  .info-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
