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
          :custom-components="{ ClientNameCell }"
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
import ServerSideTable from '@/modules/shared/data-table/ServerSideTable.vue'
import { getOrders } from '../api/nom_dir.ts'
import { formatValue } from '@/utils/formatters.ts'
import { useRoleStore } from '@/modules/_main/store/index.js'

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

    const currentPage = ref(1)
    const itemsPerPage = ref(1) //15
    const totalPages = ref(0)
    const sortColumn = ref('id')
    const sortOrder = ref('desc')

    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    startDate.value = threeMonthsAgo.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]

    const fetchOrders = async () => {
      try {
        const response = await getOrders({
          page: currentPage.value,
          limit: itemsPerPage.value,
          search: searchQuery.value,
          sortCol: sortColumn.value,
          sortDir: sortOrder.value,
          date1: startDate.value,
          date2: endDate.value,
          type: roleStore.selectedTypes,
          role: roleStore.selectedRole,
        })

        if (response && response.table) {
          orders.value = response.table.data || []
          tableFields.value = Object.entries(response.table.fields || {}).map(
            ([key, field]) => ({
              name: key,
              title: field.title,
              width: field.width,
              type: field.type || 'string', // Убедитесь, что у каждого поля есть тип
              permissions: field.permissions || { read: true, update: false },
            })
          );

          totalCount.value = response.header.total_count || 0
          totalPages.value = Math.ceil(totalCount.value / itemsPerPage.value)
        } else {
          orders.value = []
          totalCount.value = 0
          totalPages.value = 0
        }
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error)
        orders.value = []
        totalCount.value = 0
        totalPages.value = 0
      }
    }

    const filteredTableFields = computed(() => {
      return _.cloneDeep(tableFields.value).filter(
        (field) => field.name !== 'id' && field.name !== 'goz'
      )
    })

    const tableColumns = computed(() => {
      return filteredTableFields.value.map((field) => {
        console.log(field.name, field.type) // Логируем каждое поле по имени и типу
        console.log('---')
        return {
          name: field.name,
          title: field.title,
          sortable: true,
          format: (value) => formatValue(value, field.type),
        }
      })
    })



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
