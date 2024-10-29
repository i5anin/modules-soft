<template>
  <div>
    <div class="grid-container" :style="gridStyle">
      <div class="order-info-card p-2" :class="{ collapsed: isCollapsed }">
        <router-link
          :to="{ name: 'OrdersTable' }"
          tag="button"
          class="btn btn-secondary me-3 mb-2 btn-sm btn-outline-light"
        >
          <svg-icon type="mdi" :path="path" class="me-1" />
          Назад к заказам
        </router-link>

        <!-- Содержимое, которое можно свернуть -->
        <div v-if="!isCollapsed">
          <OrderInfoCard :header="header" />
        </div>

        <!-- Кнопка для сворачивания -->
        <button class="btn btn-link toggle-btn" @click="toggleCollapse">
          {{ isCollapsed ? 'Развернуть' : 'Свернуть' }}
        </button>
      </div>

      <!-- Компонент SborMain занимает 10 колонок -->
      <div class="sbor-main">
        <SborMain
          v-if="nomtable.length > 0"
          :nomtable="nomtable"
          :tableFields="filteredTableFields"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderById } from '../api/orders.js'
import OrderInfoCard from './HeaderCardInfo.vue'
import _ from 'lodash'
import { useRoleStore } from '../../main/store/index.js'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeft } from '@mdi/js'
import SborMain from '@/modules/shared/sborka/SborMain.vue'

const router = useRouter()
const roleStore = useRoleStore()

const nomtable = ref([])
const header = ref({})
const tableFields = ref([])
const isCollapsed = ref(false)

const path = mdiArrowLeft
const selectedRole = computed(() => roleStore.selectedRole)

const fetchOrderData = async () => {
  const orderId = router.currentRoute.value.params.orderId
  try {
    const response = await getOrderById(
      orderId,
      roleStore.selectedTypes,
      roleStore.selectedRole
    )
    nomtable.value = response.table.data
    header.value = response.header
    tableFields.value = response.table.fields
  } catch (error) {
    console.error('Ошибка при загрузке заказа:', error)
  }
}

const filteredTableFields = computed(() =>
  _.filter(tableFields.value, (field) => !field.name.startsWith('status_'))
)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// Динамический стиль для изменения ширины колонок
const gridStyle = computed(() => ({
  gridTemplateColumns: isCollapsed.value ? '4fr 9fr' : '3fr 9fr',
}))

onMounted(() => {
  fetchOrderData()
})

watch(selectedRole, () => {
  fetchOrderData()
})
</script>

<style scoped>
.grid-container {
  display: grid;
  gap: 16px;
}

.order-info-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  position: relative;
}

.toggle-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
