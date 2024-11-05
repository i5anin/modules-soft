<template>
  <div>
    <div class="grid-container">
      <div class="p-2" :class="{ collapsed: isCollapsed }">
        <router-link :to="{ name: 'OrdersTable' }" custom>
          <button class="btn btn-secondary me-3 mb-2 btn-sm btn-outline-light">
            <svg-icon type="mdi" :path="path" class="me-1" />
            Назад к заказам
          </button>
        </router-link>

        <!-- Содержимое карточки -->
        <OrderInfoCard :header="header" />
      </div>

      <!-- Компонент SborMain занимает оставшееся пространство -->
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
import OrderInfoCard from './Card.vue'
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
