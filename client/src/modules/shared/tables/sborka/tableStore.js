import { defineStore } from 'pinia'
import axios from 'axios'

export const useTableStore = defineStore('tableStore', {
  state: () => ({
    tableData: [], // Данные таблицы
    pendingUpdates: [], // Поля, ожидающие подтверждения изменений
    isLoading: false,
    error: null,
  }),

  actions: {
    // Загрузка данных
    async loadTableData(apiEndpoint) {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get(apiEndpoint)
        this.tableData = response.data
      } catch (err) {
        this.error = err.message || 'Ошибка загрузки данных'
      } finally {
        this.isLoading = false
      }
    },

    // Фиксация изменений (без отправки на сервер)
    addPendingUpdate({ fieldName, oldValue, newValue, updateTable }) {
      const existingIndex = this.pendingUpdates.findIndex(
        (update) =>
          update.fieldName === fieldName && update.newValue === newValue
      )

      if (existingIndex === -1) {
        this.pendingUpdates.push({ fieldName, oldValue, newValue, updateTable })
      }
    },

    // Подтверждение изменений (отправка на сервер)
    async confirmUpdates() {
      try {
        for (const update of this.pendingUpdates) {
          const payload = {
            fieldName: update.fieldName,
            value: update.newValue,
            updateTable: update.updateTable, // Используем таблицу из изменения
          }
          await axios.post('/api/update', payload)
        }

        this.pendingUpdates = [] // Очищаем список после успешного подтверждения
      } catch (err) {
        this.error = err.message || 'Ошибка подтверждения изменений'
        throw err
      }
    },

    // Отмена изменений
    cancelUpdates() {
      this.pendingUpdates = [] // Очищаем список изменений
    },
  },
})
