<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <PageSizeSelector
        :page-sizes="pageSizes"
        :model-value="localItemsPerPage"
        @update:model-value="updateItemsPerPage"
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

    <!-- 🔄 Скелетон во время загрузки -->
    <TableSkeleton v-if="loading" :column-count="7" />

    <!-- ✅ Основная таблица после загрузки -->
    <SborMain
      v-else
      :table-data="items"
      :table-fields="filteredHeaders"
      :detail="detail"
    />

    <!-- 📄 Пагинация тоже показывается только после загрузки -->
    <Pagination
      v-if="!loading"
      :total-count="totalCnt"
      :items-per-page="localItemsPerPage"
      :current-page="currentPg"
      :total-pages="totalPg"
      @page-change="goToPage"
    />
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { formatISO } from 'date-fns'
  import SearchBar from '@/shared/widgets/SearchInput.vue'
  import Pagination from '@/shared/widgets/PaginationControl.vue'
  import PageSizeSelector from '@/shared/widgets/PageSizeSelect.vue'
  import DateRangeFilters from '@/shared/forms/DateRangeFilters.vue'
  import SborMain from '../sborka/SborMain.vue'
  import TableSkeleton from '@/shared/ui/LoadingTableSkeleton.vue'

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
    detail: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits([
    'row-click',
    'page-change',
    'sort-change',
    'page-size-change',
    'search-change',
    'date-range-change',
  ])

  const localItemsPerPage = ref(props.itemsPerPage)
  const localStartDate = ref(props.startDate ? new Date(props.startDate) : null)
  const localEndDate = ref(props.endDate ? new Date(props.endDate) : null)
  const loading = ref(false)

  const pageSizes = computed(() => props.itemsPerPageOptions)

  const filteredHeaders = computed(() =>
    props.headers.filter((header) => !props.excluded.includes(header.name))
  )

  const totalCnt = computed(() => props.totalCount)
  const currentPg = computed(() => props.currentPage)
  const totalPg = computed(() => props.totalPages)

  const updateItemsPerPage = (value) => {
    localItemsPerPage.value = value
    emit('page-change', 1)
    emit('page-size-change', value)
  }

  const updateStartDate = (value) => {
    localStartDate.value = value
    emit('date-range-change', {
      startDate: value ? formatISO(value, { representation: 'date' }) : '',
      endDate: localEndDate.value
        ? formatISO(localEndDate.value, { representation: 'date' })
        : '',
    })
  }

  const updateEndDate = (value) => {
    localEndDate.value = value
    emit('date-range-change', {
      startDate: localStartDate.value
        ? formatISO(localStartDate.value, { representation: 'date' })
        : '',
      endDate: value ? formatISO(value, { representation: 'date' }) : '',
    })
  }

  const onSearch = (query) => {
    loading.value = true
    emit('search-change', query)
    setTimeout(() => (loading.value = false), 500)
  }

  const goToPage = (page) => {
    emit('page-change', page)
  }
</script>
