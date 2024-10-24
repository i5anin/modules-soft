<template>
  <div>
    <!-- Search and Page Size Selection in one line -->
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

      <!-- Search Input -->
      <div class="d-flex align-items-center position-relative">
        <label class="me-2">Поиск:</label>
        <div class="position-relative">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control me-2 search-input"
            placeholder="Введите текст для поиска"
            :disabled="loading"
          />
          <!-- Кнопка очистки поля, показывается только при наличии текста в поле -->
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="btn btn-link position-absolute top-50 end-0 translate-middle-y"
            style="padding: 0; color: gray"
          >
            <i class="bi bi-x-circle"></i>
          </button>
        </div>
        <button @click="onSearch" class="btn btn-primary" :disabled="loading">
          Поиск
        </button>
        <div v-if="loading" class="spinner-border ms-2" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>
    </div>

    <table class="table table-striped">
      <thead>
        <tr>
          <th
            v-for="column in columns"
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
          v-for="row in data"
          :key="row.id"
          @click="handleRowClick(row)"
          :class="{ 'table-row': true, locked: row.locked }"
        >
          <td v-for="(field, index) in filteredFields" :key="index">
            <StatusDisplay v-if="field.name === 'statuses'" :row="row" />
            <span v-else>{{ formatValue(row[field.name], field.name) }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-between align-items-center mt-3">
      <p class="text-muted mb-0">
        {{ startRecord }}–{{ endRecord }} из {{ totalCount }}
      </p>

      <!-- Pagination Controls -->
      <nav aria-label="Page navigation">
        <ul class="pagination mb-0">
          <li
            class="page-item"
            :class="{ disabled: currentPage === 1 }"
            @click="goToPage(1)"
          >
            <a class="page-link" href="javascript:void(0)">«</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === 1 }"
            @click="goToPage(currentPage - 1)"
          >
            <a class="page-link" href="javascript:void(0)">‹</a>
          </li>
          <li class="page-item active">
            <span class="page-link">{{ currentPage }}</span>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
            @click="goToPage(currentPage + 1)"
          >
            <a class="page-link" href="javascript:void(0)">›</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
            @click="goToPage(totalPages)"
          >
            <a class="page-link" href="javascript:void(0)">»</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import StatusDisplay from '@/modules/shared/data-table/StatusDisplay.vue'

export default {
  name: 'DataTable',
  components: { StatusDisplay },
  props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    excluded: {
      type: Array,
      default: () => [],
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => [15, 30, 50, 100],
    },
    totalPages: {
      type: Number,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    sortColumn: {
      type: String,
      default: '',
    },
    sortOrder: {
      type: String,
      default: 'asc',
    },
    formatValue: {
      type: Function,
      default: (value) => value,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
    customComponents: {
      type: Object,
      default: () => ({}),
    },
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
    const searchQuery = ref('')
    const loading = ref(false)

    const filteredFields = computed(() => {
      return props.columns.filter(
        (field) => !props.excluded.includes(field.name)
      )
    })

    watch(
      () => props.itemsPerPage,
      (newValue) => {
        localItemsPerPage.value = newValue
      }
    )

    const noData = computed(() => {
      return props.data.length === 0
    })

    const goToPage = (page) => {
      if (page < 1) page = 1
      if (page > props.totalPages) page = props.totalPages
      emit('page-change', page)
    }

    const sortBy = (column) => {
      const columnObj = props.columns.find((col) => col.name === column)
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

    const onSearch = () => {
      loading.value = true
      emit('search-change', searchQuery.value)
      setTimeout(() => {
        loading.value = false
      }, 1000)
    }

    const clearSearch = () => {
      searchQuery.value = ''
      emit('search-change', '')
    }

    const startRecord = computed(
      () => (props.currentPage - 1) * localItemsPerPage.value + 1
    )
    const endRecord = computed(() =>
      Math.min(props.currentPage * localItemsPerPage.value, props.totalCount)
    )

    return {
      localItemsPerPage,
      pageSizes,
      noData,
      goToPage,
      sortBy,
      handleRowClick,
      onPageSizeChange,
      onSearch,
      clearSearch,
      searchQuery,
      sortColumn: computed(() => props.sortColumn),
      sortOrder: computed(() => props.sortOrder),
      currentPage: computed(() => props.currentPage),
      totalPages: computed(() => props.totalPages),
      startRecord,
      endRecord,
      totalCount: computed(() => props.totalCount),
      loading,
      filteredFields,
    }
  },
}
</script>

<style>
.table tbody tr.table-row {
  cursor: pointer;
}

.table tbody tr.locked td {
  color: #aaaaaa;
}

th.sortable {
  cursor: pointer;
}

th.sortable:hover {
  background-color: #f1f1f1;
}

th .bi {
  margin-left: 5px;
}

.search-input {
  width: 300px;
}

.spinner-border {
  width: 20px;
  height: 20px;
}
</style>
