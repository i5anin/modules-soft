<template>
  <div>
    <!-- Page Size Selection -->
    <div class="d-flex align-items-center mb-3">
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

    <!-- Data Table -->
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
</template>

<script>
import { ref, computed, watch, resolveDynamicComponent } from 'vue'

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
    totalPages: {
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
  emits: ['row-click', 'page-change', 'sort-change', 'page-size-change'],
  setup(props, { emit }) {
    const localItemsPerPage = ref(props.itemsPerPage)
    const pageSizes = props.itemsPerPageOptions

    // Watch for changes from parent component
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

    return {
      localItemsPerPage,
      pageSizes,
      noData,
      goToPage,
      sortBy,
      handleRowClick,
      onPageSizeChange,
      sortColumn: computed(() => props.sortColumn),
      sortOrder: computed(() => props.sortOrder),
      currentPage: computed(() => props.currentPage),
      totalPages: computed(() => props.totalPages),
      customComponents: props.customComponents,
      formatValue: props.formatValue,
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
