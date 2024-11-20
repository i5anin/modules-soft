<template>
  <table class="table table-striped table-bordered table-hover">
    <thead>
      <tr>
        <th
          v-for="column in tableStore.filteredHeaders"
          :key="column.name"
          @click="column.sortable && handleSortChange(column.name)"
          :class="{ sortable: column.sortable }"
        >
          {{ column.title }}
          <span v-if="column.sortable">
            <i
              v-if="
                tableStore.sortColumn === column.name &&
                tableStore.sortOrder === 'asc'
              "
              class="bi bi-caret-up-fill"
            ></i>
            <i
              v-else-if="
                tableStore.sortColumn === column.name &&
                tableStore.sortOrder === 'desc'
              "
              class="bi bi-caret-down-fill"
            ></i>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="!tableStore.items.length">
        <td colspan="100%" class="text-center">Нет данных</td>
      </tr>
      <tr
        v-for="row in tableStore.items"
        :key="row.id"
        @click="handleRowClick(row)"
        :class="{ locked: row.locked, 'table-success': row.goz }"
      >
        <td v-for="field in tableStore.filteredHeaders" :key="field.name">
          <StatusDisplay v-if="field.name === 'statuses'" :row="row" />
          <span
            v-else
            v-html="formatValue(row[field.name], field.type, field.name)"
          ></span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { useServerSideTableStore } from './stores/serverSideTable'
import StatusDisplay from '@/modules/shared/StatusDisplay.vue'

export default {
  components: { StatusDisplay },
  props: {
    formatValue: { type: Function, required: true },
  },
  setup(_, { emit }) {
    const tableStore = useServerSideTableStore()

    const handleSortChange = (column) => {
      const isAsc =
        tableStore.sortColumn === column && tableStore.sortOrder === 'asc'
      tableStore.setSort(column, isAsc ? 'desc' : 'asc')
      emit('sort-change', { column, order: tableStore.sortOrder })
    }

    const handleRowClick = (row) => {
      emit('row-click', row)
    }

    return {
      tableStore,
      handleSortChange,
      handleRowClick,
    }
  },
}
</script>
