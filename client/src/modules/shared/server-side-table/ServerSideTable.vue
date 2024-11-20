<template>
  <div v-if="tableStore.items.length">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <PageSizeSelector
        :pageSizes="tableStore.itemsPerPageOptions"
        :modelValue="tableStore.itemsPerPage"
        @update:modelValue="updateItemsPerPage"
      />
      <DateRangeFilters v-if="tableStore.datepicker" />
      <SearchBar :loading="tableStore.loading" @search-change="onSearch" />
    </div>
    <DataTable
      :headers="tableStore.filteredHeaders"
      :items="tableStore.items"
      :sortColumn="tableStore.sortColumn"
      :sortOrder="tableStore.sortOrder"
      :formatValue="formatValue"
      @row-click="handleRowClick"
    />
    <Pagination
      :totalCount="tableStore.totalCount"
      :itemsPerPage="tableStore.itemsPerPage"
      :currentPage="tableStore.currentPage"
      :totalPages="tableStore.totalPages"
      @page-change="goToPage"
    />
  </div>
</template>

<script>
import { useServerSideTableStore } from './stores/serverSideTable'
import SearchBar from '@/modules/shared/modules-server-side/SearchBar.vue'
import Pagination from '@/modules/shared/modules-server-side/Pagination.vue'
import DataTable from './Table.vue'
import PageSizeSelector from './PageSizeSelector.vue'
import DateRangeFilters from '../modules-server-side/DateRangeFilters.vue'
import { formatValue } from '@/utils/formatters-2.js'
import { watch, onMounted } from 'vue'

export default {
  name: 'ServerSideTable',
  components: {
    DataTable,
    SearchBar,
    Pagination,
    PageSizeSelector,
    DateRangeFilters,
  },
  setup() {
    const tableStore = useServerSideTableStore()

    onMounted(() => {
      tableStore.initializeTable()
    })

    const updateItemsPerPage = (value) => {
      tableStore.setItemsPerPage(value)
    }

    const onSearch = (query) => {
      tableStore.setLoading(true)
      setTimeout(() => {
        tableStore.setSearchQuery(query)
        tableStore.setLoading(false)
      }, 500)
    }

    const goToPage = (page) => {
      tableStore.setCurrentPage(page)
    }

    const handleRowClick = (row) => {
      console.log('Row clicked:', row)
    }

    return {
      tableStore,
      updateItemsPerPage,
      onSearch,
      goToPage,
      handleRowClick,
      formatValue,
    }
  },
}
</script>
