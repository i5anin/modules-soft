<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <PageSizeSelector
        :pageSizes="pageSizes"
        :modelValue="localItemsPerPage"
        @update:modelValue="updateItemsPerPage"
      />
      <DateRangeFilters
        v-if="datepicker"
        :start="localStartDate"
        :end="localEndDate"
        @update:start="updateStartDate"
        @update:end="updateEndDate"
      />
      <SearchBar :loading="loading" @search-change="onSearch" />
    </div>

    <SborMain
      :headers="headers"
      :items="items"
      :sortColumn="sortColumn"
      :sortOrder="sortOrder"
      :formatValue="formatValue"
      @row-click="handleRowClick"
      @sort-change="sortBy"
    />

    <Pagination
      :totalCount="totalCnt"
      :itemsPerPage="localItemsPerPage"
      :currentPage="currentPg"
      :totalPages="totalPg"
      @page-change="goToPage"
    />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import SearchBar from '@/modules/shared/server-side/modules-server-side/SearchBar.vue'
import Pagination from '@/modules/shared/server-side/modules-server-side/Pagination.vue'
import PageSizeSelector from './PageSizeSelector.vue'
import DateRangeFilters from '@/modules/shared/server-side/modules-server-side/DateRangeFilters.vue'
import { formatValue } from '@/utils/formatters-2.js'
import SborMain from '@/modules/shared/table/sborka/SborMain.vue'

export default {
  name: 'ServerSideTable',
  components: {
    SborMain,
    SearchBar,
    Pagination,
    PageSizeSelector,
    DateRangeFilters,
  },
  props: {
    items: { type: Array, required: true },
    headers: { type: Array, required: true },
    excluded: { type: Array, default: () => [] },
    itemsPerPageOptions: { type: Array, default: () => [15, 30, 50, 100] },
    totalPages: { type: Number, required: true },
    totalCount: { type: Number, required: true },
    currentPage: { type: Number, required: true },
    sortColumn: { type: String, default: '' },
    sortOrder: { type: String, default: 'asc' },
    itemsPerPage: { type: Number, required: true },
    datepicker: { type: Boolean, default: false },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
  },
  emits: [
    'row-click',
    'page-change',
    'sort-change',
    'page-size-change',
    'search-change',
    'date-range-change',
  ],
  setup(props, { emit }) {
    const localItemsPerPage = ref(props.itemsPerPage)
    const localStartDate = ref(
      props.startDate ? new Date(props.startDate) : null
    )
    const localEndDate = ref(props.endDate ? new Date(props.endDate) : null)
    const loading = ref(false)

    const pageSizes = computed(() => props.itemsPerPageOptions)

    const filteredHeaders = computed(() =>
      props.headers.filter((header) => !props.excluded.includes(header.name))
    )

    const totalCnt = computed(() => props.totalCount)
    const currentPg = computed(() => props.currentPage)
    const totalPg = computed(() => props.totalPages)

    const sortBy = (column) => {
      const isAsc = props.sortColumn === column && props.sortOrder === 'asc'
      emit('sort-change', { column, order: isAsc ? 'desc' : 'asc' })
    }

    const handleRowClick = (row) => emit('row-click', row)

    const updateItemsPerPage = (value) => {
      localItemsPerPage.value = value
      emit('page-size-change', value)
    }

    const updateStartDate = (value) => {
      localStartDate.value = value
      emit('date-range-change', {
        startDate: value ? value.toISOString().split('T')[0] : '',
        endDate: localEndDate.value
          ? localEndDate.value.toISOString().split('T')[0]
          : '',
      })
    }

    const updateEndDate = (value) => {
      localEndDate.value = value
      emit('date-range-change', {
        startDate: localStartDate.value
          ? localStartDate.value.toISOString().split('T')[0]
          : '',
        endDate: value ? value.toISOString().split('T')[0] : '',
      })
    }

    const onSearch = (query) => {
      loading.value = true
      emit('search-change', query)
      setTimeout(() => (loading.value = false), 500)
    }

    const goToPage = (page) => emit('page-change', page)

    return {
      pageSizes,
      localItemsPerPage,
      localStartDate,
      localEndDate,
      filteredHeaders,
      loading,
      totalCnt,
      currentPg,
      totalPg,
      sortBy,
      handleRowClick,
      updateItemsPerPage,
      updateStartDate,
      updateEndDate,
      onSearch,
      goToPage,
      formatValue,
    }
  },
}
</script>
