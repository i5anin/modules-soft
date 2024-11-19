<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <PageSizeSelector
        :pageSizes="pageSizes"
        :modelValue="localItemsPerPage"
        @update:modelValue="localItemsPerPage = $event"
        @page-size-change="onPageSizeChange"
      />

      <DateRangeFilters
        v-if="datepicker"
        :start="localStartDate"
        :end="localEndDate"
        @update:start="localStartDate = $event"
        @update:end="localEndDate = $event"
        @date-range-change="onDateChange"
      />

      <SearchBar :loading="loading" @search-change="onSearch" />
    </div>

    <Table
      :headers="headers"
      :items="items"
      :sortColumn="sortColumn"
      :sortOrder="sortOrder"
      :excluded="excluded"
      :filteredFields="filteredFields"
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
import { computed, ref, defineProps, defineEmits } from 'vue'
import { formatValue } from '@/utils/formatters-2.ts'
import SearchBar from '@/modules/shared/modules-server-side/SearchBar.vue'
import Pagination from '@/modules/shared/modules-server-side/Pagination.vue'
import Table from './Table.vue'
import PageSizeSelector from './PageSizeSelector.vue'
import DateRangeFilters from './DateRangeFilters.vue'

export default {
  name: 'ServerSideTable',
  components: {
    Table,
    SearchBar,
    Pagination,
    PageSizeSelector,
    DateRangeFilters,
  },
  setup() {
    const props = defineProps({
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
    })

    const emit = defineEmits([
      'row-click',
      'page-change',
      'sort-change',
      'page-size-change',
      'search-change',
      'date-range-change',
    ])

    const pageSizes = ref(props.itemsPerPageOptions)
    const localItemsPerPage = ref(props.itemsPerPage)
    const localStartDate = ref(props.startDate)
    const localEndDate = ref(props.endDate)
    const loading = ref(false)

    const filteredFields = computed(() =>
      props.headers.filter((field) => !props.excluded.includes(field.name))
    )

    const totalCnt = computed(() => props.totalCount)
    const currentPg = computed(() => props.currentPage)
    const totalPg = computed(() => props.totalPages)

    const sortBy = (column) => {
      const columnObj = props.headers.find((col) => col.name === column)
      if (!columnObj || !columnObj.sortable) return
      const newOrder =
        props.sortColumn === column && props.sortOrder === 'asc'
          ? 'desc'
          : 'asc'
      emit('sort-change', { column, order: newOrder })
    }

    const handleRowClick = (row) => {
      emit('row-click', row)
    }

    const onPageSizeChange = () => {
      emit('page-size-change', localItemsPerPage.value)
    }

    const onSearch = (query) => {
      loading.value = true
      emit('search-change', query)
      setTimeout(() => {
        loading.value = false
      }, 500)
    }

    const onDateChange = () => {
      emit('date-range-change', {
        startDate: localStartDate.value,
        endDate: localEndDate.value,
      })
    }

    const goToPage = (page) => {
      emit('page-change', page)
    }

    return {
      pageSizes,
      localItemsPerPage,
      localStartDate,
      localEndDate,
      filteredFields,
      loading,
      totalCnt,
      currentPg,
      totalPg,
      sortBy,
      handleRowClick,
      onPageSizeChange,
      onSearch,
      onDateChange,
      goToPage,
      formatValue,
    }
  },
}
</script>
