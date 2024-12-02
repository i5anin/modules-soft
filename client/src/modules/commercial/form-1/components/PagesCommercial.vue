<template>
  <div>
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getOrders } from '../api/list.js'
import ServerSideTable from '@/modules/shared/tables/table-server/ServerSideTable.vue'
import { useRoleStore } from '@/modules/_main/store/index.js'

export default {
  components: { ServerSideTable },
  props: {
    initialStartDate: {
      type: String,
      required: true,
    },
    initialEndDate: {
      type: String,
      required: true,
    },
  },
  setup(props) {
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
    const sortColumn = ref('date')
    const sortOrder = ref('desc')

    // Инициализация диапазона дат из пропсов
    const startDate = ref(props.initialStartDate)
    const endDate = ref(props.initialEndDate)

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
        type: 'kp',
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

    const tableColumns = computed(() =>
      tableFields.value.map((field) => ({
        name: field.name,
        title: field.title,
        type: field.type,
        sortable: true,
      }))
    )

    const handleRowClick = (row) => {
      router.push({ name: 'Order', params: { orderId: row.id } })
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
