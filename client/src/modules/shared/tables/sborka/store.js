// stores/useSborStore.js
import { defineStore } from 'pinia'

export const store = defineStore('sbor', {
  state: () => ({
    tableData: [], // Данные таблицы
    tableFields: [], // Заголовки таблицы
    selectedSbor: null,
  }),
  getters: {
    filteredFields(state) {
      return state.tableFields
    },

    hasIsSborField(state) {
      return state.tableData.some((row) => row.is_sbor === true)
    },
    hasStatusField(state) {
      return state.tableFields.some((field) => field.name.includes('status'))
    },
    // Новый геттер filteredTableData
    filteredTableData(state) {
      const includedFields = new Set(
        state.tableFields.map((header) => header.name)
      )
      return state.tableData.map((row) => {
        // Возвращаем объект с только нужными полями
        const filteredRow = {}
        for (const key in row) {
          if (includedFields.has(key)) filteredRow[key] = row[key]
        }
        return filteredRow
      })
    },
  },
  actions: {
    setTableData(data) {
      this.tableData = data
    },
    setTableFields(fields) {
      this.tableFields = fields
    },
  },
})
