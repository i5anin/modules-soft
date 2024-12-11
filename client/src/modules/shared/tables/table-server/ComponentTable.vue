<template>
  <div>
    <LoadingSpinner v-if="loading" :padding="'35vh 0'" />

    <div v-else>
      <table class="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th v-if="showStatusColumn" :style="headerStyle">Статусы</th>
            <th
              v-for="column in filteredHeaders"
              :key="column.name"
              :style="headerStyle"
              @click="handleSortChange(column)"
            >
              {{ column.title }}
              <i v-if="column.sortable" :class="getSortIcon(column)"></i>
            </th>
            <th v-if="editButton" :title="'Колонка редактировать'"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!items.length">
            <td colspan="100%" class="text-center">Нет данных</td>
          </tr>
          <tr
            v-for="row in items"
            :key="row.id"
            :class="getRowClass(row)"
            @click="$emit('row-click', row)"
          >
            <td v-if="showStatusColumn">
              <StatusDisplay :row="row" />
            </td>
            <td
              v-for="field in filteredFields"
              :key="field.name"
              :style="{ textAlign: getTextAlignment(field.type) }"
            >
              <span v-html="formatValue(row[field.name], field.type)"></span>
            </td>
            <td v-if="editButton" @click.stop="handleEditClick(row)">
              <button class="btn btn-sm">
                <i class="bi bi-pencil-fill text-muted"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <EditModal
        v-if="editButton"
        :visible="isModalVisible"
        :row="selectedRow"
        :headers="headers"
        title="Редактирование строки"
        @close="closeModal"
        @save="saveRowChanges"
      />
    </div>
  </div>
</template>

<script>
import LoadingSpinner from '@/modules/shared/components/LoadingSpinner.vue'
import StatusDisplay from '@/modules/shared/components/StatusDisplay.vue'
import EditModal from './EditModal.vue'
import { computed, ref } from 'vue'

export default {
  components: { LoadingSpinner, StatusDisplay, EditModal },
  props: {
    headers: { type: Array, required: true },
    items: { type: Array, required: true },
    excluded: { type: Array, default: () => [] },
    sortColumn: { type: String, required: true },
    sortOrder: { type: String, required: true },
    formatValue: { type: Function, required: true },
    getTextAlignment: { type: Function, required: true },
    editButton: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const loading = ref(false)
    const isModalVisible = ref(false)
    const selectedRow = ref(null)

    const statusPattern = /status/i

    const filteredFields = computed(() =>
      props.headers.filter(
        (header) =>
          !props.excluded.includes(header.name) &&
          !statusPattern.test(header.name)
      )
    )

    const filteredHeaders = computed(() =>
      props.headers.filter((header) => !statusPattern.test(header.name))
    )

    const allHeaders = computed(() => props.headers)

    const showStatusColumn = computed(() => {
      const firstItem = props.items[0]
      if (!firstItem) return false

      return Object.keys(firstItem).some((key) =>
        key.toLowerCase().includes('status')
      )
    })

    const handleEditClick = (row) => {
      selectedRow.value = row
      isModalVisible.value = true
    }

    const saveRowChanges = (updatedRow) => {
      emit('save', updatedRow)
      isModalVisible.value = false
    }

    const closeModal = () => {
      isModalVisible.value = false
      selectedRow.value = null
    }

    const handleSortChange = (column) => {
      if (column.sortable) {
        emit('sort-change', column.name)
      }
    }

    const getSortIcon = (column) => {
      if (props.sortColumn === column.name) {
        return props.sortOrder === 'asc'
          ? 'bi bi-caret-up-fill'
          : 'bi bi-caret-down-fill'
      }
      return ''
    }

    const getRowClass = (row) => {
      return {
        locked: row.locked,
        'table-success': row.goz,
      }
    }

    const headerStyle = { fontSize: '0.90rem' }

    return {
      loading,
      filteredFields,
      filteredHeaders,
      allHeaders,
      showStatusColumn,
      isModalVisible,
      selectedRow,
      handleEditClick,
      saveRowChanges,
      closeModal,
      handleSortChange,
      getSortIcon,
      getRowClass,
      headerStyle,
    }
  },
}
</script>

<style scoped>
.table th,
.table td {
  min-width: 8px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
}

.table th {
  cursor: pointer;
}

.table .btn {
  padding: 0.25rem 0.5rem;
}

.table .btn .bi {
  font-size: 1rem;
}
</style>
