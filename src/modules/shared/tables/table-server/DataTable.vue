<template>
  <div>
    <!-- Индикатор загрузки -->
    <LoadingSpinner v-if="loading" :padding="'35vh 0'" />
    <!-- Таблица -->
    <div v-else>
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th
              v-if="showStatusColumn"
              :style="{ fontSize: '0.90rem', width: '50px' }"
            >
              Статусы
            </th>
            <th
              v-for="column in filteredFields"
              :key="column.name"
              :style="{ fontSize: '0.90rem' }"
              @click="handleSort(column)"
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
            <td colspan="100%" class="text-center"> Нет данных</td>
          </tr>
          <tr
            v-for="row in items"
            :key="row.id"
            :class="{ locked: row.locked }"
            @click="emit('row-click', row)"
          >
            <td v-if="showStatusColumn">
              <StatusDisplay :row="row" />
            </td>
            <td
              v-for="field in filteredFields"
              :key="field.name"
              :style="{ textAlign: getTextAlignment(field.type, field.name) }"
              :class="{
                'table-success': row.goz && field.name === 'clients__name',
                'table-warning': row.exp && field.name === 'clients__name',
              }"
            >
              <span
                v-html="formatValue(row[field.name], field.type, field.name)"
              />
            </td>
            <td v-if="editButton" @click.stop="openEditModal(row)">
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

<script setup>
  import { computed, defineEmits, defineProps, ref, watch } from 'vue'
  import StatusDisplay from '@/modules/shared/components/ui/StatusDisplay.vue'
  import EditModal from './EditModal.vue'
  import LoadingSpinner from '@/modules/shared/components/ui/LoadingSpinner.vue'

  const props = defineProps({
    headers: { type: Array, required: true },
    items: { type: Array, required: true },
    excluded: { type: Array, default: () => [] },
    sortColumn: { type: String, required: true },
    sortItem: { type: String, required: true },
    formatValue: { type: Function, required: true },
    getTextAlignment: { type: Function, default: () => 'left' },
    editButton: { type: Boolean, default: false },
  })

  const emit = defineEmits(['row-click', 'sort-change'])

  const loading = ref(true)
  const isModalVisible = ref(false)
  const selectedRow = ref(null)

  const normalizedHeaders = computed(() =>
    props.headers.map((header) => ({
      ...header,
      permissions: header.permissions || { read: true },
    }))
  )

  const filteredFields = computed(() =>
    normalizedHeaders.value.filter(
      (header) =>
        !props.excluded.includes(header.name) && header.permissions.read
    )
  )

  const showStatusColumn = computed(() => {
    const firstItem = props.items[0]
    return (
      firstItem &&
      Object.keys(firstItem).some((key) => key.toLowerCase().includes('status'))
    )
  })

  const handleSort = (column) => {
    if (column.sortable) emit('sort-change', column.name)
  }

  // Следим за items: если данные появились, отключаем загрузку
  watch(
    () => props.items,
    (newItems) => {
      loading.value = !(Array.isArray(newItems) && newItems.length > 0)
    },
    { immediate: true }
  )

  const openEditModal = (row) => {
    selectedRow.value = row
    isModalVisible.value = true
  }

  const closeModal = () => {
    isModalVisible.value = false
    selectedRow.value = null
  }

  const saveRowChanges = () => {
    closeModal()
  }
</script>

<style>
  .table th,
  .table td {
    overflow: hidden;
    overflow-wrap: break-word;
    text-align: center;
    vertical-align: middle;
  }
</style>
