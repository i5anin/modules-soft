<template>
  <div class="container">
    <div class="mt-4 d-flex align-items-center mb-2">
      <router-link :to="{ name: 'OrdersTable' }" class="btn btn-secondary me-3">
        <svg-icon type="mdi" :path="path" class="me-1" />
        Назад к заказам
      </router-link>
    </div>

    <OrderInfoCard :header="header" />

    <DetailsTable
      v-if="
        selectedRole !== 'tech_calc' &&
        selectedRole !== 'managers' &&
        nomtable.length > 0
      "
      :fields="filteredTableFields"
      :data="nomtable"
      :rowLink="true"
      :linkPath="getOrderDetailsPath"
      tableTitle="Информация о заказе"
    />
    <SborMain
      v-if="
        (selectedRole === 'tech_calc' || selectedRole === 'managers') &&
        nomtable.length > 0
      "
      :nomtable="nomtable"
      :tableFields="filteredTableFields"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import DetailsTable from '@/modules/shared/data-table/BaseTable.vue'
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
const header = ref([])
const tableFields = ref([])

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

// Фильтрация заголовков таблицы
const filteredTableFields = computed(() => {
  const fields = _.filter(
    tableFields.value,
    (field) => !field.name.startsWith('status_')
  )
  fields.unshift({ name: 'statuses', title: 'Статусы' })
  return fields
})

// Получение пути для деталей заказа
const getOrderDetailsPath = (row) => {
  if (row.ordersnom_id) {
    return {
      name: 'OrderDetailsDetails',
      params: { id: row.ordersnom_id },
    }
  } else {
    return null
  }
}

// Загрузка данных при монтировании
onMounted(() => {
  fetchOrderData()
})

// Наблюдение за изменением selectedRole
watch(selectedRole, (newValue) => {
  fetchOrderData() // Запрос данных при изменении роли
})
</script>
