<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Таблица данных -->
        <ServerSideTable
          datepicker
          :headers="tableColumns"
          :items="orders"
          :items-per-page-options="[15, 30, 50, 100]"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-count="totalCount"
          :sort-column="sortColumn"
          :sort-order="sortOrder"
          :custom-components="{ StatusCell, ClientNameCell }"
          @row-click="handleRowClick"
          @page-change="handlePageChange"
          @sort-change="handleSortChange"
          @page-size-change="handlePageSizeChange"
          @search-change="handleSearchChange"
          @date-range-change="handleDateRangeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import { getOrders } from '../api/list.ts'
import ServerSideTable from '@/modules/shared/server-side/ServerSideTable.vue'
import { useRoleStore } from '@/modules/_main/store/index.js'
import { statuses } from '@/modules/shared/statuses.js'

export default {
  components: { ServerSideTable },
  setup() {
    const router = useRouter()
    const orders = ref([])
    const tableFields = ref([])
    const totalCount = ref(0)
    const searchQuery = ref('')

    const roleStore = useRoleStore()

    // Состояние пагинации и сортировки
    const currentPage = ref(1)
    const itemsPerPage = ref(15)
    const totalPages = ref(0)
    const sortColumn = ref('')
    const sortOrder = ref('')

    // Инициализация диапазона дат
    const defaultEndDate = new Date()
    const defaultStartDate = new Date()
    defaultStartDate.setMonth(defaultEndDate.getMonth() - 3)

    const startDate = ref(defaultStartDate.toISOString().slice(0, 10))
    const endDate = ref(defaultEndDate.toISOString().slice(0, 10))

    // Получение данных с сервера
    const fetchOrders = () => {
      return getOrders({
        page: currentPage.value,
        limit: itemsPerPage.value,
        search: searchQuery.value,
        sortCol: sortColumn.value,
        sortDir: sortOrder.value,
        date1: startDate.value,
        date2: endDate.value,
        type: roleStore.selectedTypes,
        module: roleStore.selectedRole,
      })
        .then((response) => {
          orders.value = response.table.data

          tableFields.value = Object.entries(response.table.fields).map(
            ([key, field]) => ({
              name: key,
              title: field.title,
              type: field.type,
              width: field.width,
              update: field.update || false,
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

    const tableColumns = computed(() =>
      filteredTableFields.value.map((field) => {
        const column = {
          name: field.name,
          title: field.title,
          type: field.type,
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
    )

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

    const handleDateRangeChange = ({
      startDate: newStartDate,
      endDate: newEndDate,
    }) => {
      if (newStartDate) startDate.value = newStartDate
      if (newEndDate) endDate.value = newEndDate
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
      tableColumns,
      handleRowClick,
      handlePageChange,
      handleSortChange,
      handlePageSizeChange,
      handleSearchChange,
      handleDateRangeChange,
      currentPage,
      totalPages,
      sortColumn,
      sortOrder,
      itemsPerPage,
      totalCount,
      StatusCell,
      ClientNameCell,
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
