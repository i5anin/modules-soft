<template>
  <div>
    <!-- Индикатор загрузки -->
    <LoadingSpinner v-if="loading" :padding="'35vh 0'" />

    <!-- Таблица -->
    <div v-else>
      <table class="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th
              v-if="showStatusColumn"
              :style="{ fontSize: '0.90rem', width: '50px' }"
            >
              Статусы
            </th>
            <th
              v-for="column in headers"
              :key="column.name"
              @click="column.sortable && $emit('sort-change', column.name)"
              :style="{ fontSize: '0.90rem' }"
            >
              {{ column.title }}
              <span v-if="column.sortable">
                <i
                  v-if="sortColumn === column.name && sortItem === 'asc'"
                  class="bi bi-caret-up-fill"
                ></i>
                <i
                  v-else-if="sortColumn === column.name && sortItem === 'desc'"
                  class="bi bi-caret-down-fill"
                ></i>
              </span>
            </th>
            <th v-if="editButton" title="Колонка редактировать"></th>
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
            <td v-if="showStatusColumn">
              <StatusDisplay :row="row" />
            </td>
            <td
              v-for="field in filteredFields"
              :key="field.name"
              :style="{ textAlign: getTextAlignment(field.type, field.name) }"
            >
              <span
                v-html="formatValue(row[field.name], field.type, field.name)"
              ></span>
            </td>

            <td @click.stop="handleEditClick(row)" v-if="editButton">
              <button class="btn btn-sm">
                <i class="bi bi-pencil-fill" style="color: gray"></i>
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
    sortItem: { type: String, required: true },
    formatValue: { type: Function, required: true },
    getTextAlignment: { type: Function, default: true },
    editButton: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const loading = ref(false)
    const filteredFields = computed(() =>
      props.headers.filter((header) => !props.excluded.includes(header.name))
    )

    const showStatusColumn = computed(() => {
      const firstItem = props.items[0]
      if (!firstItem) return false
      return Object.keys(firstItem).some((key) =>
        key.toLowerCase().includes('status')
      )
    })

    const isModalVisible = ref(false)
    const selectedRow = ref(null)

    const handleEditClick = (row) => {
      selectedRow.value = row
      isModalVisible.value = true
    }

    const saveRowChanges = (updatedRow) => {
      console.log('Сохранено:', updatedRow)
      isModalVisible.value = false
    }

    const closeModal = () => {
      isModalVisible.value = false
      selectedRow.value = null
    }

    return {
      loading,
      filteredFields,
      showStatusColumn,
      handleEditClick,
      isModalVisible,
      selectedRow,
      closeModal,
      saveRowChanges,
    }
  },
}
</script>

<style>
.table th,
.table td {
  min-width: 8px;
  max-width: 300px;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table {
  table-layout: fixed; /* Фиксированная ширина колонок */
  width: 100%; /* Ширина таблицы на 100% */
}

.table th {
  font-size: 0.9rem;
  text-align: center;
  vertical-align: middle;
}
</style>
