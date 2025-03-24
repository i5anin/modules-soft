<template>
  <div>
    <!-- Индикатор загрузки -->
    <ThinProgressBar
      :loading="loading"
      :progress="50"
    />
    <div v-if="!loading">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <PageSizeSelector
          v-model="localItemsPerPage"
          :page-sizes="itemsPerPageOptions"
          @update:model-value="updateItemsPerPage"
        />
        <DateRangeFilters
          v-if="datepicker"
          v-model:start="localStartDate"
          v-model:end="localEndDate"
          @update:start="updateDateRange"
          @update:end="updateDateRange"
        />
        <SearchBar
          :loading="loading"
          @search-change="onSearch"
        />
      </div>
      <DataTable
        :headers="headers"
        :items="items"
        :sort-column="sortColumn"
        :sort-item="sortItem"
        :format-value="formatValue"
        :edit-button="editButton"
        :get-text-alignment="getTextAlignment"
        @row-click="handleRowClick"
        @sort-change="sortBy"
      />
      <Pagination
        :total-count="totalCnt"
        :items-per-page="localItemsPerPage"
        :current-page="currentPg"
        :total-pages="totalPg"
        @page-change="goToPage"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import moment from 'moment'
  import SearchBar from '@/modules/shared/components/search/SearchBar.vue'
  import Pagination from '@/modules/shared/components/pagination/TablePagination.vue'
  import PageSizeSelector from '@/modules/shared/components/pagination/PageSizeSelector.vue'
  import DataTable from './DataTable.vue'
  import DateRangeFilters from '@/modules/shared/components/forms/DateRangeFilters.vue'
  import ThinProgressBar from '@/modules/shared/components/ui/ThinProgressBar.vue'
  import { formatValue, getTextAlignment } from '@/utils/formatters.js'

  const props = defineProps({
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
  })

  const emit = defineEmits([
    'row-click',
    'sort-change',
    'page-change',
    'items-per-page-change',
    'date-range-change',
    'search-change',
  ])

  const localItemsPerPage = ref(props.itemsPerPage)
  const localStartDate = ref(
    props.startDate
      ? moment(props.startDate).isValid()
        ? moment(props.startDate).toDate()
        : null
      : null
  )
  const localEndDate = ref(
    props.endDate
      ? moment(props.endDate).isValid()
        ? moment(props.endDate).toDate()
        : null
      : null
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
      await new Promise((resolve) => setTimeout(resolve, 500)) // Заглушка, заменить на API-запрос
    } finally {
      loading.value = false
    }
  }

  // Следим за изменениями параметров и обновляем данные
  watch(
    [
      () => props.currentPage,
      localItemsPerPage,
      () => props.sortColumn,
      () => props.sortItem,
      localStartDate,
      localEndDate,
    ],
    fetchData,
    { immediate: true }
  )

  // Обработчики событий
  const handleRowClick = (row) => emit('row-click', row)
  const sortBy = (column) => emit('sort-change', column)
  const goToPage = (page) => emit('page-change', page)
  const updateItemsPerPage = (size) => emit('items-per-page-change', size)
  const updateDateRange = () =>
    emit('date-range-change', {
      start: localStartDate.value,
      end: localEndDate.value,
    })
  const onSearch = (query) => emit('search-change', query)
</script>
