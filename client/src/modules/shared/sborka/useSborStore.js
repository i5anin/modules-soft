// stores/useSborStore.js
import { defineStore } from 'pinia'

export const useSborStore = defineStore('sbor', {
  state: () => ({
    tableData: [], // Данные таблицы
    tableHeaders: [], // Заголовки таблицы
    selectedSbor: null,
  }),
  getters: {
    filteredFields(state) {
      const excludedFields = ['sbor_orders__id', 'is_sbor', 'ordersnom_id']
      return state.tableHeaders.filter(
        (field) => !excludedFields.includes(field.name)
      )
    },
    hasIsSborField(state) {
      return state.tableData.some((row) => row.is_sbor === true)
    },
    hasStatusField(state) {
      return state.tableHeaders.some((field) => field.name.includes('status'))
    },
  },
  actions: {
    setTableData(data) {
      this.tableData = data
    },
    setTableHeaders(headers) {
      this.tableHeaders = headers
    },
    selectSbor(sbor) {
      this.selectedSbor = sbor
    },
  },
})
