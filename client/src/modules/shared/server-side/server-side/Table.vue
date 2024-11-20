<template>
  <table class="table table-striped table-bordered table-hover">
    <thead>
      <tr>
        <th
          v-for="column in headers"
          :key="column.name"
          @click="column.sortable && $emit('sort-change', column.name)"
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
      <tr v-if="!items.length">
        <td colspan="100%" class="text-center">Нет данных</td>
      </tr>
      <tr
        v-for="row in items"
        :key="row.id"
        @click="$emit('row-click', row)"
        :class="{ locked: row.locked, 'table-success': row.goz }"
      >
        <td v-for="field in filteredFields" :key="field.name">
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
import StatusDisplay from '@/modules/shared/StatusDisplay.vue'
import { computed } from 'vue'

export default {
  components: { StatusDisplay },
  props: {
    headers: { type: Array, required: true },
    items: { type: Array, required: true },
    excluded: { type: Array, default: () => [] },
    sortColumn: { type: String, required: true },
    sortOrder: { type: String, required: true },
    formatValue: { type: Function, required: true },
  },
  setup(props) {
    const filteredFields = computed(() =>
      props.headers.filter((header) => !props.excluded.includes(header.name))
    )

    return {
      filteredFields,
    }
  },
}
</script>
