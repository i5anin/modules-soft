<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Заголовок -->
        <h3 class="client-name mb-3">Список клиентов</h3>

        <!-- Таблица данных -->
        <ServerSideTable
          :data="clients || []"
          :columns="tableFields || []"
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
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import _ from 'lodash'
import ServerSideTable from '@/modules/shared/server-side/ServerSideTable.vue'
import { getClients } from '../api/clients.ts'
import { useRoleStore } from '@/modules/_main/store/index.js'
import BaseTable from '@/modules/shared/data-table/BaseTable.vue'

export default {
  components: { BaseTable, ServerSideTable },
  setup() {
    const clients = ref([])
    const tableFields = ref([])
    const roleStore = useRoleStore()
    const router = useRouter()
    const currentPage = ref(1)
    const itemsPerPage = ref(15)
    const totalCount = ref(0)
    const totalPages = computed(() =>
      Math.ceil(totalCount.value / itemsPerPage.value)
    )
    const sortColumn = ref('id')
    const sortOrder = ref('desc')
    const searchSearch = ref('')

    const fetchClients = async () => {
      try {
        const response = await getClients({
          page: currentPage.value,
          limit: itemsPerPage.value,
          sortCol: sortColumn.value,
          sortDir: sortOrder.value,
          type: roleStore.selectedTypes,
          role: roleStore.selectedRole,
          search: searchSearch.value,
        })

        if (response && response.table) {
          clients.value = response.table.data || []

          // Фильтрация полей по условию read === true
          tableFields.value = Object.entries(response.table.fields || {})
            .filter(([, field]) => field.permissions?.read) // Только поля с read: true
            .map(([key, field]) => ({
              name: key,
              title: field.title,
              width: field.width,
              type: field.type || 'string',
              permissions: field.permissions || { read: true, update: false },
            }))

          totalCount.value =
            response?.header?.total_count || clients.value.length
        } else {
          clients.value = []
          totalCount.value = 0
        }
      } catch (error) {
        console.error('Ошибка при загрузке списка клиентов:', error)
        clients.value = []
        totalCount.value = 0
      }
    }

    const handleRowClick = (row) => {
      router.push({
        name: 'Nomenclature',
        params: { clientId: row.clients__id },
      })
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      fetchClients() // Используйте fetchClients вместо fetchOrders
    }

    const handleSortChange = ({ column, order }) => {
      sortColumn.value = column
      sortOrder.value = order
      currentPage.value = 1
      fetchClients() // Используйте fetchClients вместо fetchOrders
    }

    const handlePageSizeChange = (size) => {
      itemsPerPage.value = size
      currentPage.value = 1
      fetchClients() // Используйте fetchClients вместо fetchOrders
    }

    const handleSearchChange = (search) => {
      searchSearch.value = search
      currentPage.value = 1
      fetchClients() // Используйте fetchClients вместо fetchOrders
    }

    onMounted(() => {
      fetchClients()
    })

    return {
      clients,
      tableFields,
      currentPage,
      totalPages,
      sortColumn,
      sortOrder,
      itemsPerPage,
      totalCount,
      handleRowClick,
      handlePageChange,
      handleSortChange,
      handlePageSizeChange,
      handleSearchChange,
    }
  },
}
</script>

<style scoped>
.client-name {
  font-weight: bold;
}
</style>
