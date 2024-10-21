<!-- DataTable.vue -->
<template>
  <div>
    <!-- Page Size Selection -->
    <div class="d-flex align-items-center mb-3">
      <label class="me-2">Показать на странице:</label>
      <select v-model="localItemsPerPage" class="form-select w-auto">
        <option v-for="size in pageSizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
    </div>

    <!-- Data Table -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.name"
            @click="sortBy(column.name)"
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
          v-for="row in paginatedData"
          :key="row.id"
          @click="handleRowClick(row)"
          :class="{ 'table-row': true, locked: row.locked }"
        >
          <td v-for="column in columns" :key="column.name">
            <component
              :is="column.cellComponent || 'span'"
              :row="row"
              :column="column"
            >
              <!-- Default cell content if no component is provided -->
              {{ formatValue(row[column.name], column.name) }}
            </component>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation" class="mt-3">
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
          @click="goToPage(1)"
        >
          <a class="page-link" href="javascript:void(0)">««</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
          @click="goToPage(currentPage - 1)"
        >
          <a class="page-link" href="javascript:void(0)">«</a>
        </li>
        <li class="page-item active">
          <span class="page-link">{{ currentPage }}</span>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
          @click="goToPage(currentPage + 1)"
        >
          <a class="page-link" href="javascript:void(0)">»</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
          @click="goToPage(totalPages)"
        >
          <a class="page-link" href="javascript:void(0)">»»</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import _ from 'lodash'

export default {
  name: 'DataTable',
  props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    itemsPerPageOptions: {
      type: Array,
      default: () => [15, 30, 50, 100],
    },
    initialSortColumn: {
      type: String,
      default: '',
    },
    initialSortOrder: {
      type: String,
      default: 'asc',
    },
    formatValue: {
      type: Function,
      default: (value) => value,
    },
  },
  emits: ['row-click'],
  setup(props, { emit }) {
    const localItemsPerPage = ref(props.itemsPerPageOptions[0])
    const currentPage = ref(1)
    const sortColumn = ref(props.initialSortColumn)
    const sortOrder = ref(props.initialSortOrder)
    const pageSizes = props.itemsPerPageOptions

    const sortedData = computed(() => {
      if (!sortColumn.value) {
        return props.data
      }
      return _.orderBy(props.data, [sortColumn.value], [sortOrder.value])
    })

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * localItemsPerPage.value
      const end = start + localItemsPerPage.value
      return sortedData.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(sortedData.value.length / localItemsPerPage.value)
    })

    const noData = computed(() => {
      return sortedData.value.length === 0
    })

    const goToPage = (page) => {
      if (page < 1) page = 1
      if (page > totalPages.value) page = totalPages.value
      currentPage.value = page
    }

    const sortBy = (column) => {
      if (sortColumn.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortColumn.value = column
        sortOrder.value = 'asc'
      }
    }

    const handleRowClick = (row) => {
      emit('row-click', row)
    }

    // Watch for changes in items per page
    watch(localItemsPerPage, () => {
      currentPage.value = 1
    })

    return {
      localItemsPerPage,
      currentPage,
      pageSizes,
      paginatedData,
      totalPages,
      noData,
      goToPage,
      sortColumn,
      sortOrder,
      sortBy,
      formatValue: props.formatValue,
      handleRowClick,
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
</style>
