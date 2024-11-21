<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="d-flex align-items-center mb-1">
          <BackButton targetRoute="Clients" class="me-3" />
          <h3 class="client-name m-0">{{ clientName }}</h3>
        </div>

        <!-- Таблица данных -->
        <SborkaServerSideTable
          :items="noms"
          :headers="tableFields"
          :items-per-page-options="[15, 30, 50, 100]"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-count="totalCount"
          :sort-column="sortColumn"
          :sort-order="sortOrder"
          @page-change="updatePage"
          @search-change="handleSearchChange"
          @sort-change="updateSorting"
          @page-size-change="updateItemsPerPage"
          @row-click="handleRowClick"
          @date-range-change="handleDateRangeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getClientNom } from '../api/nom_dir.js'
import { useRoleStore } from '@/modules/_main/store/index.js'
import BackButton from '@/modules/shared/BackButton.vue'
import SborkaServerSideTable from '@/modules/shared/server-side/server-side-sborka/ServerSideTable.vue'

export default {
  components: { SborkaServerSideTable, BackButton },
  setup() {
    const route = useRoute()
    const clientName = ref('')
    const noms = ref([])
    const tableFields = ref([])
    const totalCount = ref(0)
    const roleStore = useRoleStore()
    const currentPage = ref(1)
    const itemsPerPage = ref(15)
    const totalPages = ref(0)
    const sortColumn = ref('id')
    const sortOrder = ref('desc')
    const searchQuery = ref('') // Переменная для строки поиска

    // Получаем client_id из параметров маршрута
    const clientId = computed(() => route.params.clientId)

    const fetchNoms = async () => {
      try {
        const response = await getClientNom({
          client_id: clientId.value,
          page: currentPage.value,
          limit: itemsPerPage.value,
          sortCol: sortColumn.value,
          sortDir: sortOrder.value,
          type: roleStore.selectedTypes,
          role: roleStore.selectedRole,
          search: searchQuery.value, // Передаем строку поиска
        })

        if (response && response.table) {
          noms.value = response.table.data || []
          tableFields.value = Object.entries(response.table.fields || {}).map(
            ([key, field]) => ({
              name: key,
              title: field.title,
              width: field.width,
              type: field.type || 'string',
              permissions: field.permissions || { read: true, update: false },
            })
          )
          clientName.value = response.header.client_name || ''
          totalCount.value = response.header.total_count || 0
          totalPages.value = Math.ceil(totalCount.value / itemsPerPage.value)
        } else {
          noms.value = []
          totalCount.value = 0
          totalPages.value = 0
        }
      } catch (error) {
        console.error('Ошибка при загрузке номенклатуры:', error)
        noms.value = []
        totalCount.value = 0
        totalPages.value = 0
      }
    }

    const updatePage = (page) => {
      currentPage.value = page
      fetchNoms()
    }

    const handleSearchChange = (search) => {
      searchQuery.value = search // Сохраняем строку поиска
      currentPage.value = 1 // Сбрасываем на первую страницу
      fetchNoms() // Вызываем обновление данных
    }

    const updateSorting = ({ column, order }) => {
      sortColumn.value = column
      sortOrder.value = order
      fetchNoms()
    }

    const updateItemsPerPage = (value) => {
      itemsPerPage.value = value
      fetchNoms()
    }

    const handleRowClick = (row) => {
      console.log('Клик по строке:', row)
    }

    const handleDateRangeChange = (range) => {
      console.log('Изменение диапазона дат:', range)
      // Добавьте логику, если требуется
    }

    onMounted(() => {
      fetchNoms()
    })

    return {
      clientName,
      noms,
      tableFields,
      currentPage,
      totalPages,
      sortColumn,
      sortOrder,
      itemsPerPage,
      totalCount,
      updatePage,
      handleSearchChange,
      updateSorting,
      updateItemsPerPage,
      handleRowClick,
      handleDateRangeChange,
    }
  },
}
</script>

<style scoped>
.client-name {
  font-weight: bold;
}
</style>
