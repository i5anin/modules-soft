<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Кнопка Назад -->
        <BackButton />

        <!-- Название клиента -->
        <h3 class="client-name mb-3">{{ clientName }}</h3>

        <!-- Таблица данных -->
        <ServerSideTable
          :table-fields="tableFields"
          :items="orders || []"
          :headers="tableFields"
          :items-per-page-options="[15, 30, 50, 100]"
          :items-per-page="itemsPerPage"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-count="totalCount"
          :sort-column="sortColumn"
          :sort-order="sortOrder"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrders } from '../api/nom_dir.ts'
import { useRoleStore } from '@/modules/_main/store/index.js'
import BackButton from '@/modules/shared/BackButton.vue'
import ServerSideTable from '@/modules/shared/server-side/server-side-sborka/ServerSideTable.vue'

export default {
  components: { ServerSideTable, BackButton },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const clientName = ref('')
    const orders = ref([])
    const tableFields = ref([])
    const totalCount = ref(0)
    const roleStore = useRoleStore()
    const currentPage = ref(1)
    const itemsPerPage = ref(20)
    const totalPages = ref(0)
    const sortColumn = ref('id')
    const sortOrder = ref('desc')

    // Получаем client_id из параметров маршрута
    const clientId = computed(() => route.params.clientId)

    const fetchOrders = async () => {
      try {
        const response = await getOrders({
          client_id: clientId.value,
          page: currentPage.value,
          limit: itemsPerPage.value,
          sortCol: sortColumn.value,
          sortDir: sortOrder.value,
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
              type: field.type || 'string',
              permissions: field.permissions || { read: true, update: false },
            })
          )
          clientName.value = response.header.client_name || ''
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

    onMounted(() => {
      fetchOrders()
    })

    return {
      clientName,
      orders,
      tableFields,
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
.client-name {
  font-weight: bold;
}
</style>
