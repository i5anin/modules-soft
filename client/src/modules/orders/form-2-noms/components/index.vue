<template>
  <div>
    <div class="grid-container">
      <div class="p-2" :class="{ collapsed: isCollapsed }">
        <router-link :to="{ name: 'OrdersTable' }" v-slot="{ href, isActive }">
          <button
            :class="[
              'btn',
              'btn-secondary',
              'me-3',
              'mb-2',
              'btn-sm',
              'btn-outline-light',
              { active: isActive },
            ]"
            :href="href"
          >
            <svg-icon type="mdi" :path="path" class="me-1" />
            Назад к заказам
          </button>
        </router-link>
        <!-- Содержимое карточки -->
        <OrderInfoCard :header="headerData" />
      </div>

      <!-- Компонент SborMain занимает оставшееся пространство -->
      <div class="sbor-main">
        <SborMain
          v-if="nomTableData.length > 0"
          :nomtable="nomTableData"
          :tableFields="filteredTableFields"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderById } from '../api/nom_list.ts'
import OrderInfoCard from './Card.vue'
import { useRoleStore } from '@/modules/_main/store/index.js'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeft } from '@mdi/js'
import SborMain from '@/modules/shared/sborka/SborMain.vue'

const router = useRouter()
const roleStore = useRoleStore()

// Данные для заголовка и таблицы
const nomTableData = ref([])
const headerData = ref({})
const tableFields = ref({})
const isCollapsed = ref(false)

const path = mdiArrowLeft
const selectedRole = computed(() => roleStore.selectedRole)

// Получение данных заказа
const fetchOrderData = async () => {
  const orderId = router.currentRoute.value.params.orderId
  const type = roleStore.selectedTypes
  const role = roleStore.selectedRole
  try {
    const response = await getOrderById({ orderId, type, role })
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
