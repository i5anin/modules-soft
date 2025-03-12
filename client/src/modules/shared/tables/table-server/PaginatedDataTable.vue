<template>
  <div>
    <!-- Индикатор загрузки -->
    <ThinProgressBar :loading="loading" :progress="50" />

    <!-- Контент таблицы -->
    <div v-if="!loading">
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

      <DataTable
        :headers="headers"
        :items="items"
        :sortColumn="sortColumn"
        :sortItem="sortItem"
        :formatValue="formatValue"
        :edit-button="editButton"
        :getTextAlignment="getTextAlignment"
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
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import moment from 'moment'
import SearchBar from '@/modules/shared/components/search/SearchBar.vue'
import Pagination from '@/modules/shared/components/pagination/Pagination.vue'
import PageSizeSelector from '@/modules/shared/components/pagination/PageSizeSelector.vue'
import DataTable from './DataTable.vue'
import DateRangeFilters from '@/modules/shared/components/forms/DateRangeFilters.vue'
import ThinProgressBar from '@/modules/shared/components/ui/ThinProgressBar.vue'
import { formatValue, getTextAlignment } from '@/utils/formatters.js'

export default {
  name: 'PaginatedDataTable',
  components: {
    DataTable,
    SearchBar,
    Pagination,
    PageSizeSelector,
    DateRangeFilters,
    ThinProgressBar,
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
    sortItem: { type: String, default: '' },
    itemsPerPage: { type: Number, required: true },
    datepicker: { type: Boolean, default: false },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    editButton: { type: Boolean, default: false },
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
      props.startDate ? moment(props.startDate).toDate() : null
    )
    const localEndDate = ref(
      props.endDate ? moment(props.endDate).toDate() : null
    )
    const loading = ref(false)

    const totalCnt = computed(() => props.totalCount)
    const currentPg = computed(() => props.currentPage)
    const totalPg = computed(() => props.totalPages)

    /**
     * Имитация загрузки данных (заменить на реальный API вызов)
     */
    const fetchData = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
      } finally {
        loading.value = false
      }
    }

    // Следим за изменениями в пагинации, сортировке, фильтрах и обновляем данные
    watch(
      [
        currentPg,
        localItemsPerPage,
        props.sortColumn,
        props.sortItem,
        localStartDate,
        localEndDate,
      ],
      fetchData,
      { immediate: true }
    )

    const sortBy = column => {
      const isAsc = props.sortColumn === column && props.sortItem === 'asc'
      emit('sort-change', { column, item: isAsc ? 'desc' : 'asc' })
      fetchData()
    }

    const handleRowClick = row => emit('row-click', row)

    const updateItemsPerPage = value => {
      localItemsPerPage.value = value
      emit('page-size-change', value)
      fetchData()
    }

    const updateDateRange = () => {
      emit('date-range-change', {
        startDate: localStartDate.value
          ? moment(localStartDate.value).format('YYYY-MM-DD')
          : '',
        endDate: localEndDate.value
          ? moment(localEndDate.value).format('YYYY-MM-DD')
          : '',
      })
      fetchData()
    }

    const updateStartDate = value => {
      localStartDate.value = value
      updateDateRange()
    }

    const updateEndDate = value => {
      localEndDate.value = value
      updateDateRange()
    }

    const onSearch = query => {
      emit('search-change', query)
      fetchData()
    }

    const goToPage = page => {
      emit('page-change', page)
      fetchData()
    }

    return {
      localItemsPerPage,
      localStartDate,
      localEndDate,
      totalCnt,
      currentPg,
      totalPg,
      goToPage,
      sortBy,
      handleRowClick,
      updateItemsPerPage,
      updateStartDate,
      updateEndDate,
      onSearch,
      formatValue,
      getTextAlignment,
      loading,
    }
  },
}
</script>
