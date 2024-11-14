<template>
  <div>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <!-- Page Size Selection -->
      <div class="d-flex align-items-center me-3">
        <label class="me-2">Показать на странице:</label>
        <select
          v-model="localItemsPerPage"
          class="form-select w-auto"
          @change="onPageSizeChange"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- SearchBar Component -->
      <SearchBar :loading="loading" @search-change="onSearch" />
    </div>

    <table class="table table-striped table-bordered table-hover">
      <thead>
        <tr>
          <th
            v-for="column in headers"
            :key="column.name"
            @click="column.sortable && sortBy(column.name)"
            :class="{ sortable: column.sortable }"
          >
            {{ column.title }}
            <span v-if="column.sortable">
              <i
                v-if="sortColumn === column.name && sortOrder === 'asc'"
                class="bi bi-caret-up-fill"
              ></i>
              <i
                v-else-if="sortColumn === column.name && sortOrder === 'desc'"
                class="bi bi-caret-down-fill"
              ></i>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="noData">
          <td colspan="100%" class="text-center">Нет данных</td>
        </tr>
        <tr
          v-for="row in items"
          :key="row.id"
          @click="handleRowClick(row)"
          :class="{
            'table-row': true,
            locked: row.locked,
            'table-success': row.goz,
          }"
        >
          <td v-for="(field, index) in filteredFields" :key="index">
            <StatusDisplay v-if="field.name === 'statuses'" :row="row" />
            <span v-else>{{ formatValue(row[field.name], field.type) }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Component -->
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
import SearchBar from '@/modules/shared/modules-server-side/SearchBar.vue'
import Pagination from '@/modules/shared/modules-server-side/Pagination.vue'
import StatusDisplay from '@/modules/shared/StatusDisplay.vue'
import { formatValue } from '@/utils/formatters-2.ts'

export default {
  name: 'ServerSideTable',
  methods: { formatValue },
  components: { SearchBar, Pagination, StatusDisplay },
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
  },
  emits: [
    'row-click',
    'page-change',
    'sort-change',
    'page-size-change',
    'search-change',
  ],
  setup(props, { emit }) {
    const localItemsPerPage = ref(props.itemsPerPage)
    const pageSizes = props.itemsPerPageOptions
    const loading = ref(false)

    const filteredFields = computed(() => {
      return props.headers.filter(
        (field) => !props.excluded.includes(field.name)
      )
    })

    const noData = computed(() => props.items.length === 0)

    const sortBy = (column) => {
      const columnObj = props.headers.find((col) => col.name === column)
      if (!columnObj || !columnObj.sortable) return
      let newOrder = 'asc'
      if (props.sortColumn === column) {
        newOrder = props.sortOrder === 'asc' ? 'desc' : 'asc'
      }
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

    const goToPage = (page) => {
      emit('page-change', page)
    }

    const currentPg = computed(() => props.currentPage)
    const totalPg = computed(() => props.totalPages)
    const totalCnt = computed(() => props.totalCount)

    return {
      localItemsPerPage,
      pageSizes,
      noData,
      sortBy,
      handleRowClick,
      onPageSizeChange,
      onSearch,
      goToPage,
      filteredFields,
      loading,
      currentPg,
      totalPg,
      totalCnt,
    }
  },
}
</script>

<style scoped>
.table tbody tr.table-row {
  cursor: pointer;
}

th.sortable {
  cursor: pointer;
}

th.sortable:hover {
  background-color: #f1f1f1;
}
</style>
