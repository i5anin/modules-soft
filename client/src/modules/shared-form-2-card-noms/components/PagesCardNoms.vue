<template>
  <div>
    <div class="grid-container">
      <div :class="{ collapsed: isCollapsed }">
        <!--        <BackButton targetRoute="OrdersTable" />-->
        <OrderInfoCard :header="headerData" />
      </div>

      <!-- Компонент SborMain занимает оставшееся пространство -->
      <div class="sbor-main">
        <SborMain
          v-if="nomTableData.length > 0"
          :table-data="nomTableData"
          :table-fields="filteredTableFields"
          :detail="{ route: 'OrderDetails', idKey: 'ordersnom_id' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderById } from '../api/nom_list.js'
import OrderInfoCard from './form2Card.vue'
import { useRoleStore } from '@/modules/_main/store/index.js'
import SborMain from '@/modules/shared/tables/sborka/SborMain.vue'

// Объявление пропсов
const props = defineProps({
  type: { type: String, required: true },
})

const router = useRouter()
const roleStore = useRoleStore()

// Данные для заголовка и таблицы
const nomTableData = ref([])
const headerData = ref({})
const tableFields = ref({})
const isCollapsed = ref(false)

const selectedRole = computed(() => roleStore.selectedRole)

// Получение данных заказа
const fetchOrderData = async () => {
  const orderId = router.currentRoute.value.params.kpId
  const role = roleStore.selectedRole
  try {
    const response = await getOrderById({ orderId, type: props.type, role })
    headerData.value = response.header
    tableFields.value = response.table.fields
    nomTableData.value = response.table.data
  } catch (error) {
    console.error('Ошибка при загрузке заказа:', error)
  }
}

// Преобразование tableFields из объекта в массив для удобства отображения
const filteredTableFields = computed(() => {
  return Object.entries(tableFields.value)
    .filter(([key]) => !key.startsWith('status_'))
    .map(([key, field]) => ({
      name: key,
      ...field,
    }))
})

// Автоматическая загрузка данных при монтировании компонента
onMounted(() => {
  fetchOrderData()
})

// Обновление данных при изменении роли пользователя
watch(selectedRole, () => {
  fetchOrderData()
})
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 400px 1fr; /* Фиксированная ширина слева и адаптивная справа */
}

.order-info-card {
  width: 100%; /* Занимает всю фиксированную ширину сетки */
  background-color: #f8f9fa;
  border-radius: 8px;
  position: relative;
}

.sbor-main {
  width: 100%; /* Занимает оставшееся пространство справа */
}

.toggle-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
