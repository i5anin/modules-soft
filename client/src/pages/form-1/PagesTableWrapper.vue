<template>
  <div class="row">
    <div class="col-12">
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
        @row-click="navigateToRow"
        @page-change="updatePage"
        @sort-change="updateSort"
        @page-size-change="updatePageSize"
        @search-change="updateSearch"
        @date-range-change="updateDateRange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ServerSideTable from '@/modules/shared/tables/table-server/ServerSideTable.vue'
import { getItems } from '@/pages/form-1/api/list.js'
import { processFields } from '@/modules/test/fieldsProcessor.js'
import { useRoleStore } from '@/modules/_main/store/index.js'

const props = defineProps({
  type: { type: String, required: true },
  link: { type: String, required: true },
  edit: { type: Boolean, required: true },
  route: { type: String, required: true },
})

const items = ref([])
const tableFields = ref([])
const totalCount = ref(0)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(15)
const sortColumn = ref(null)
const sortItem = ref('desc')

const startDate = ref(null)
const endDate = ref(null)

const router = useRouter()
const roleStore = useRoleStore()

const totalPages = computed(() =>
  Math.ceil(totalCount.value / itemsPerPage.value)
)

const tableColumns = computed(() =>
  tableFields.value.map(({ name, title, type }) => ({
    name,
    title,
    type,
    sortable: true,
  }))
)

const fetchItems = async () => {
  try {
    const response = await getItems({
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value,
      sortCol: sortColumn.value || '',
      sortDir: sortItem.value || '',
      date1: startDate.value,
      date2: endDate.value,
      type: props.type,
      module: roleStore.selectedRole,
    })

    if (response?.table) {
      const fields = processFields(
        Object.entries(response.table.fields).map(([key, field]) => ({
          key,
          ...field,
        }))
      ).filter(({ modified }) => modified)

      tableFields.value = fields.map(({ key, title, type, width, update }) => ({
        name: key,
        title,
        type,
        width,
        update: update || false,
      }))

      // Динамическая сортировка: ищем первое поле с "date" в ключе
      const dateField = fields.find(({ key }) => key?.includes('date')) // Исправлено на key
      if (dateField) {
        sortColumn.value = dateField.key // Устанавливаем ключ найденного поля
        sortItem.value = 'desc' // По умолчанию сортировка по убыванию
      } else {
        sortColumn.value = '' // Если нет поля с "date", сброс сортировки
        sortItem.value = ''
      }

      items.value = response.table.data
      totalCount.value = response.header.total_count
    } else {
      resetData()
    }
  } catch (error) {
    console.error('Error fetching items:', error)
    resetData()
  }
}

const resetData = () => {
  items.value = []
  totalCount.value = 0
}

const navigateToRow = (row) => {
  router.push({ name: props.route, params: { id: row[props.link] } })
}

const updatePage = (page) => {
  currentPage.value = page
  fetchItems()
}

const updateSort = ({ column, item }) => {
  sortColumn.value = column
  sortItem.value = item
  currentPage.value = 1
  fetchItems()
}

const updatePageSize = (size) => {
  itemsPerPage.value = size
  currentPage.value = 1
  fetchItems()
}

const updateSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
  fetchItems()
}

const updateDateRange = ({ startDate: newStart, endDate: newEnd }) => {
  if (newStart) startDate.value = newStart
  if (newEnd) endDate.value = newEnd
  currentPage.value = 1
  fetchItems()
}

onMounted(fetchItems)
</script>

<style scoped>
.table tbody tr {
  cursor: pointer;
}

th.sortable {
  cursor: pointer;
}

th.sortable:hover {
  background-color: #f1f1f1;
}
</style>
