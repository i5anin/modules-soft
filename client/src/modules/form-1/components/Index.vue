<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Фильтры по диапазону дат -->
        <div
          class="date-range-filters d-flex align-items-center justify-content-start mb-3"
        >
          <div class="d-flex align-items-center">
            <label for="start-date" class="form-label fw-bold me-2 mb-0"
              >С</label
            >
            <DateRangeFilter
              id="start-date"
              class="custom-date-range-filter flex-grow-1"
              v-model="startDate"
            />
          </div>
          <div class="d-flex align-items-center ms-3">
            <label for="end-date" class="form-label fw-bold me-2 mb-0"
              >По</label
            >
            <DateRangeFilter
              id="end-date"
              class="custom-date-range-filter flex-grow-1"
              v-model="endDate"
            />
          </div>
        </div>

        <!-- Таблица данных -->
        <ServerSideTable
          :data="orders"
          :columns="tableColumns"
          :items-per-page-options="[15, 30, 50, 100]"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-count="totalCount"
          :sort-column="sortColumn"
          :sort-order="sortOrder"
          :format-value="formatValue"
          :custom-components="{ StatusCell, ClientNameCell }"
          @row-click="handleRowClick"
          @page-change="handlePageChange"
          @sort-change="handleSortChange"
          @page-size-change="handlePageSizeChange"
          @search-change="handleSearchChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import DateRangeFilter from './DateRangeFilter.vue'
import ServerSideTable from '../../shared/data-table/ServerSideTable.vue'
import { getOrders } from '../api/orders.js'
import { formatValue } from '@/utils/formatters.js'
import { useRoleStore } from '../../main/store/index.js'
import { statuses } from '@/modules/shared/statuses.js'

export default {
  components: { DateRangeFilter, ServerSideTable },
  setup() {
    const router = useRouter()
    const startDate = ref(null)
    const endDate = ref(null)
    const orders = ref([])
    const tableFields = ref([])
    const totalCount = ref(0)
    const searchQuery = ref('')

    const roleStore = useRoleStore()

    // Состояние пагинации и сортировки
    const currentPage = ref(1)
    const itemsPerPage = ref(15)
    const totalPages = ref(0)
    const sortColumn = ref('id')
    const sortOrder = ref('desc')

    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    startDate.value = threeMonthsAgo.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]

    const fetchOrders = () => {
      return getOrders(
        currentPage.value,
        itemsPerPage.value,
        searchQuery.value,
        null,
        null,
        startDate.value,
        endDate.value,
        roleStore.selectedTypes,
        roleStore.selectedRole,
        sortColumn.value,
        sortOrder.value
      )
        .then((response) => {
          orders.value = response.table.data

          // Преобразование `fields` из объекта в массив
          tableFields.value = Object.entries(response.table.fields).map(
            ([key, field]) => ({
              name: key,
              title: field.title,
              width: field.width,
              edit: field.edit || false,
            })
          )

          totalCount.value = response.header.total_count
          totalPages.value = Math.ceil(totalCount.value / itemsPerPage.value)
        })
        .catch((error) => {
          console.error('Ошибка при загрузке заказов:', error)
          orders.value = []
          totalPages.value = 0
        })
    }

    const filteredTableFields = computed(() => {
      const fields = _.filter(
        tableFields.value,
        (field) =>
          !field.name.startsWith('ordersnom__status_') &&
          field.name !== 'id' &&
          field.name !== 'goz'
      )
      fields.splice(1, 0, { name: 'statuses', title: 'Статусы' })
      fields.forEach((field) => {
        if (field.name === 'status_ready') field.title = ''
      })
      return fields
    })

    const startRecord = computed(
      () => (currentPage.value - 1) * itemsPerPage.value + 1
    )
    const endRecord = computed(() =>
      Math.min(currentPage.value * itemsPerPage.value, totalCount.value)
    )

    const tableColumns = computed(() => {
      return filteredTableFields.value.map((field) => {
        let column = {
          name: field.name,
          title: field.title,
          sortable: true,
        }

        if (field.name === 'statuses') {
          column.cellComponent = 'StatusCell'
          column.sortable = false
        } else if (field.name === 'clients__name') {
          column.cellComponent = 'ClientNameCell'
        }
        return column
      })
    })

    const StatusCell = {
      name: 'StatusCell',
      props: ['row'],
      template: `<span v-html="renderStatus(row)"></span>`,
      setup() {
        const renderStatus = (row) => {
          const activeStatuses = _.filter(
            statuses,
            (s) => row[s.status] && row[s.status].trim() !== ''
          )

          if (activeStatuses.length > 0) {
            return activeStatuses
              .map(
                (s) =>
                  `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`
              )
              .join('')
          } else {
            return ''
          }
        }
        return { renderStatus }
      },
    }

    const ClientNameCell = {
      name: 'ClientNameCell',
      props: ['row', 'column'],
      template: `<span :style="{ backgroundColor: row.goz ? 'lightgreen' : '' }">
                    {{ row[column.name] }}
                  </span>`,
    }

    const handleRowClick = (row) => {
      router.push({ name: 'OrderDetails', params: { orderId: row.id } })
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      fetchOrders()
    }

    const handleSortChange = ({ column, order }) => {
      sortColumn.value = column
      sortOrder.value = order
      currentPage.value = 1
      fetchOrders()
    }

    const handlePageSizeChange = (size) => {
      itemsPerPage.value = size
      currentPage.value = 1
      fetchOrders()
    }

    const handleSearchChange = (query) => {
      searchQuery.value = query
      currentPage.value = 1
      fetchOrders()
    }

    watch(
      [
        startDate,
        endDate,
        () => roleStore.selectedTypes,
        () => roleStore.selectedRole,
      ],
      () => {
        currentPage.value = 1
        fetchOrders()
      }
    )

    onMounted(() => {
      fetchOrders()
    })

    return {
      startDate,
      endDate,
      orders,
      tableFields,
      searchQuery,
      formatValue,
      tableColumns,
      handleRowClick,
      handlePageChange,
      handleSortChange,
      handlePageSizeChange,
      handleSearchChange,
      currentPage,
      totalPages,
      sortColumn,
      sortOrder,
      itemsPerPage,
      totalCount,
      startRecord,
      endRecord,
      StatusCell,
      ClientNameCell,
    }
  },
}
</script>

<style>
.date-range-filters,
.filters {
  display: flex;
  gap: 16px;
}
</style>
