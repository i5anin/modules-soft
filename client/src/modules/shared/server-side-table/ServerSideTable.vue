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
import { onMounted } from 'vue'

export default {
  name: 'ServerSideTable',
  components: {
    DataTable,
    SearchBar,
    Pagination,
    PageSizeSelector,
    DateRangeFilters,
  },
  props: {
    items: { type: Array, required: true },
    headers: { type: Array, required: true },
    totalCount: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    currentPage: { type: Number, required: true },
    sortColumn: { type: String, default: '' },
    sortOrder: { type: String, default: 'asc' },
    itemsPerPage: { type: Number, default: 15 },
    datepicker: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const tableStore = useServerSideTableStore()

    onMounted(() => {
      tableStore.initializeTable({
        items: props.items,
        headers: props.headers,
        totalCount: props.totalCount,
        totalPages: props.totalPages,
        currentPage: props.currentPage,
        sortColumn: props.sortColumn,
        sortOrder: props.sortOrder,
        itemsPerPage: props.itemsPerPage,
        datepicker: props.datepicker,
      })
    })

    const updateItemsPerPage = (value) => {
      tableStore.itemsPerPage = value
      emit('page-size-change', value)
    }

    const onSearch = (query) => {
      tableStore.toggleLoading(true)
      tableStore.searchQuery = query
      emit('search-change', query)
      setTimeout(() => tableStore.toggleLoading(false), 500)
    }

    const goToPage = (page) => {
      tableStore.currentPage = page
      emit('page-change', page)
    }

    const handleRowClick = (row) => {
      emit('row-click', row)
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
