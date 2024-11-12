<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Кнопка Назад -->
        <button @click="goBack" class="btn btn-secondary mb-3">Назад</button>

        <!-- Название клиента -->
        <h3 class="client-name mb-3">{{ clientName }}</h3>

        <!-- Таблица данных -->
        <SborMain :nomtable="orders" :tableFields="tableFields" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import _ from 'lodash'
import SborMain from '@/modules/shared/sborka/SborMain.vue'
import { getOrders } from '../api/nom_dir.ts'
import { useRoleStore } from '@/modules/_main/store/index.js'

export default {
  components: { SborMain },
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

    // Переход на страницу клиентов
    const goBack = () => {
      router.push({ name: 'Clients' })
    }

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

    // Следим за изменениями clientId, чтобы обновлять данные при изменении маршрута
    watch(
      [clientId, roleStore.selectedTypes, roleStore.selectedRole],
      fetchOrders
    )

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
      goBack,
    }
  },
}
</script>

<style scoped>
.client-name {
  font-weight: bold;
}
</style>
