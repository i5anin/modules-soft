<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div
          class="date-range-filters d-flex align-items-center justify-content-start"
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

        <table id="ordersTable" class="table table-striped">
          <thead>
            <tr>
              <th v-for="field in filteredTableFields" :key="field.name">
                {{ field.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="noData">
              <td colspan="100%" class="text-center">Нет данных</td>
            </tr>
            <tr v-for="row in orders" :key="row.id">
              <td v-for="field in filteredTableFields" :key="field.name">
                <span
                  v-if="field.name === 'statuses'"
                  v-html="renderStatus(row)"
                ></span>
                <span
                  v-else-if="field.name === 'clients__name'"
                  :style="{ backgroundColor: row.goz ? 'lightgreen' : '' }"
                >
                  {{ row[field.name] }}
                </span>
                <span v-else>{{
                  formatValue(row[field.name], field.name)
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import DateRangeFilter from './DateRangeFilter.vue'
import DataTable from 'datatables.net-dt'
import $ from 'jquery'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getOrders } from '../api/orders.js'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import 'datatables.net-bs5'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import {
  formatBoolean,
  formatDate,
  formatPrice,
  formatTime,
} from '@/utils/formatters.js'
import { useRoleStore } from '../../main/store/index.js' // Импортируем store

export default {
  components: { DateRangeFilter },
  setup() {
    const ordersTable = ref(null)
    const router = useRouter()
    const startDate = ref(null)
    const endDate = ref(null)
    const noData = ref(false)
    const orders = ref([])
    const tableFields = ref([])
    const totalCount = ref(0)

    const roleStore = useRoleStore() // Получаем доступ к хранилищу Pinia

    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)
    startDate.value = threeMonthsAgo.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]

    const statuses = [
      { status: 'ordersnom__status_cal', badgeClass: 'bg-danger', label: 'К' },
      {
        status: 'ordersnom__status_instr',
        badgeClass: 'bg-warning',
        label: 'И',
      },
      {
        status: 'ordersnom__status_draft',
        badgeClass: 'bg-secondary',
        label: 'Ч',
      },
      { status: 'ordersnom__status_metall', badgeClass: 'bg-dark', label: 'М' },
      { status: 'ordersnom__status_kp', badgeClass: 'bg-success', label: 'КП' },
    ]

    const fetchOrders = () => {
      return getOrders(
        1, // Можно добавить параметр страницы и лимита для серверной обработки
        15, // Количество строк на страницу
        '', // Пустой поиск по умолчанию
        null, // Без сортировки по умолчанию
        null, // Без сортировки по умолчанию
        startDate.value,
        endDate.value,
        roleStore.selectedTypes, // Берем тип из хранилища
        roleStore.selectedRole // Берем роль из хранилища
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

    const initializeTable = () => {
      if (ordersTable.value) {
        ordersTable.value.destroy() // Уничтожаем предыдущую таблицу, если она существует
      }

      // Создаем новую таблицу
      ordersTable.value = new DataTable('#ordersTable', {
        pageLength: 15,
        lengthMenu: [15, 30, 60, 100],
        searching: true,
        processing: true,
        serverSide: false, // Мы уже получили данные, поэтому отключаем серверную обработку
        data: orders.value, // Используем полученные данные
        columns: filteredTableFields.value.map((field) => ({
          data: field.name,
          title: field.name === 'statuses' ? 'Статусы' : field.title,
          className: field.name === 'statuses' ? 'text-center' : '',
          render:
            field.name === 'statuses'
              ? (data, type, row) => renderStatus(row)
              : field.name === 'clients__name'
                ? (data, type, row) =>
                    `<span style="${row.goz ? 'background-color: lightgreen;' : ''}">${data || ''}</span>`
                : null,
        })),
        language: { url: 'Russian.json' },
        createdRow: (row, data) => {
          if (data.locked) {
            $(row).find('td').css('color', '#aaaaaa')
          }
          $(row).on('click.dt', () => {
            router.push({ name: 'OrderDetails', params: { orderId: data.id } })
          })
        },
        drawCallback: function () {
          noData.value = this.api().rows().data().length === 0
        },
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

    const renderStatus = _.memoize((row) => {
      const activeStatuses = _.filter(
        statuses,
        (s) => row[s.status] && row[s.status].trim() !== ''
      )

      if (activeStatuses.length > 0) {
        return activeStatuses
          .map(
            (s) => `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`
          )
          .join('')
      } else {
        return ''
      }
    })

    const formatValue = (value, fieldName) => {
      if (typeof value === 'boolean' && fieldName !== 'goz') {
        return formatBoolean(value)
      } else if (typeof value === 'string' && _.includes(fieldName, 'date')) {
        return formatDate(value)
      } else if (typeof value === 'number' && _.includes(fieldName, 'time')) {
        return formatTime(value)
      } else if (typeof value === 'string' && _.includes(fieldName, 'price')) {
        return formatPrice(value)
      }
      return value
    }

    onMounted(() => {
      fetchOrders().then(() => {
        initializeTable()
      })
    })

    onBeforeUnmount(() => {
      if (ordersTable.value) {
        ordersTable.value.destroy() // Уничтожаем таблицу при размонтировании
      }
    })

    watch(
      [
        startDate,
        endDate,
        () => roleStore.selectedTypes,
        () => roleStore.selectedRole,
      ],
      () => {
        fetchOrders().then(() => {
          initializeTable()
        })
      }
    )

    return {
      ordersTable,
      startDate,
      endDate,
      noData,
      orders,
      tableFields,
      renderStatus,
      filteredTableFields,
      formatValue,
      roleDisplayName: computed(() => roleStore.roleDisplayName), // Получаем имя роли
      selectedTypesDisplayName: computed(() => roleStore.selectedTypes), // Получаем выбранный тип
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
