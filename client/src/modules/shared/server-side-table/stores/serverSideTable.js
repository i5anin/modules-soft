import { defineStore } from 'pinia'

export const useServerSideTableStore = defineStore('serverSideTable', {
  state: () => ({
    items: [],
    headers: [],
    excluded: [],
    itemsPerPageOptions: [15, 30, 50, 100],
    totalPages: 0,
    totalCount: 0,
    currentPage: 1,
    sortColumn: '',
    sortOrder: 'asc',
    itemsPerPage: 15,
    datepicker: false,
    startDate: '',
    endDate: '',
    loading: false,
  }),
  getters: {
    filteredHeaders: (state) =>
      state.headers.filter((header) => !state.excluded.includes(header.name)),
  },
  actions: {
    initializeTable({
      items,
      headers,
      totalCount,
      totalPages,
      currentPage,
      sortColumn,
      sortOrder,
      itemsPerPage,
      datepicker,
    }) {
      this.items = items
      this.headers = headers
      this.totalCount = totalCount
      this.totalPages = totalPages
      this.currentPage = currentPage
      this.sortColumn = sortColumn
      this.sortOrder = sortOrder
      this.itemsPerPage = itemsPerPage
      this.datepicker = datepicker
    },
    setDateRange(start, end) {
      this.startDate = start
      this.endDate = end
    },
    toggleLoading(state) {
      this.loading = state
    },
  },
})
