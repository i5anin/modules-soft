<!-- YourMainComponent.vue -->
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Date Range Filters -->
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

        <!-- Data Table -->
        <DataTable
          :data="orders"
          :columns="tableColumns"
          :items-per-page-options="[15, 30, 50, 100]"
          :initial-sort-column="'id'"
          :initial-sort-order="'desc'"
          :format-value="formatValue"
          @row-click="handleRowClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DateRangeFilter from './DateRangeFilter.vue'
import DataTable from './DataTable.vue' // Import the reusable DataTable component
import { computed, onMounted, ref, watch } from 'vue'
import { getOrders } from '../api/orders.js'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import { formatValue } from '@/utils/formatters.js'
import { useRoleStore } from '../../main/store/index.js'
import { statuses } from '@/modules/shared/statuses.js'

export default {
  components: { DateRangeFilter, DataTable },
  setup() {
    const router = useRouter()
    const startDate = ref(null)
    const endDate = ref(null)
    const noData = ref(false)
    const orders = ref([])
    const tableFields = ref([])
    const totalCount = ref(0)

    const roleStore = useRoleStore()

    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    startDate.value = threeMonthsAgo.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]

    const fetchOrders = () => {
      return getOrders(
        1,
        1000,
        '',
        null,
        null,
        startDate.value,
        endDate.value,
        roleStore.selectedTypes,
        roleStore.selectedRole
      )
        .then((response) => {
          noData.value = response.table.data.length === 0
          orders.value = response.table.data
          tableFields.value = response.table.fields
          totalCount.value = response.header.total_count
        })
        .catch((error) => {
          console.error('Ошибка при загрузке заказов:', error)
          noData.value = true
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

    // Define columns for DataTable component
    const tableColumns = computed(() => {
      return filteredTableFields.value.map((field) => {
        let column = {
          name: field.name,
          title: field.title,
          sortable: true,
        }

        // Custom cell component for specific fields
        if (field.name === 'statuses') {
          column.cellComponent = 'StatusCell'
          column.sortable = false // Disable sorting on custom components if needed
        } else if (field.name === 'clients__name') {
          column.cellComponent = 'ClientNameCell'
        }
        return column
      })
    })

    // Components for custom cell rendering
    const StatusCell = {
      props: ['row'],
      template: `<span v-html="renderStatus(row)"></span>`,
      setup(props) {
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
      props: ['row', 'column'],
      template: `<span :style="{ backgroundColor: row.goz ? 'lightgreen' : '' }">
                  {{ row[column.name] }}
                </span>`,
    }

    // Handle row click from DataTable component
    const handleRowClick = (row) => {
      router.push({ name: 'OrderDetails', params: { orderId: row.id } })
    }

    watch(
      [
        startDate,
        endDate,
        () => roleStore.selectedTypes,
        () => roleStore.selectedRole,
      ],
      () => {
        fetchOrders()
      }
    )

    onMounted(() => {
      fetchOrders()
    })

    return {
      startDate,
      endDate,
      noData,
      orders,
      tableFields,
      formatValue,
      tableColumns,
      handleRowClick,
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
