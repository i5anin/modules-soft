<template>
  <div>
    <div class="row">
      <div class="col-12">
        <!-- Таблица данных -->
        <ServerSideTable
          datepicker
          :headers="tableColumns"
          :items="items"
          :items-per-page-options="[15, 30, 50, 100]"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-count="totalCount"
          :sort-column="sortColumn"
          :sort-item="sortItem"
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

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getItems } from '@/pages/form-1/api/list.js'
import ServerSideTable from '@/modules/shared/tables/table-server/ServerSideTable.vue'
import { useRoleStore } from '@/modules/_main/store/index.js'

// Пропсы
const props = defineProps({
  type: { type: String, required: true },
  link: { type: String, required: true },
  edit: { type: Boolean, required: true },
  route: { type: String, required: true },
})
// Реактивные переменные
const items = ref([])
const tableFields = ref([])
const totalCount = ref(0)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(15)
const totalPages = computed(() =>
  Math.ceil(totalCount.value / itemsPerPage.value)
)
const sortColumn = ref('date')
const sortItem = ref('desc')

// Инициализация диапазона дат
const startDate = ref(props.initialStartDate)
const endDate = ref(props.initialEndDate)

// Стор и роутер
const roleStore = useRoleStore()
const router = useRouter()

// Получение данных с сервера
const fetchItems = async () => {
  try {
    const response = await getItems({
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value,
      sortCol: sortColumn.value,
      sortDir: sortItem.value,
      date1: startDate.value,
      date2: endDate.value,
      type: props.type, // Используем пропсы
      module: roleStore.selectedRole,
    })

    if (response?.table) {
      items.value = response.table.data

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
    } else {
      items.value = []
      totalCount.value = 0
    }
  } catch (error) {
    console.error('Ошибка при загрузке заказов:', error)
    items.value = []
    totalCount.value = 0
  }
}

// Колонки таблицы
const tableColumns = computed(() =>
  tableFields.value.map((field) => ({
    name: field.name,
    title: field.title,
    type: field.type,
    sortable: true,
  }))
)

// Обработчики событий
const handleRowClick = (row) => {
  router.push({
    name: props.route,
    params: { id: row[props.link] }, // Используем link из пропсов
  })
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchItems()
}

const handleSortChange = ({ column, item }) => {
  sortColumn.value = column
  sortItem.value = item
  currentPage.value = 1
  fetchItems()
}

const handlePageSizeChange = (size) => {
  itemsPerPage.value = size
  currentPage.value = 1
  fetchItems()
}

const handleSearchChange = (query) => {
  searchQuery.value = query
  currentPage.value = 1
  fetchItems()
}

const handleDateRangeChange = ({
  startDate: newStartDate,
  endDate: newEndDate,
}) => {
  if (newStartDate) startDate.value = newStartDate
  if (newEndDate) endDate.value = newEndDate
  currentPage.value = 1
  fetchItems()
}

// Загрузка данных при монтировании
onMounted(fetchItems)
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
