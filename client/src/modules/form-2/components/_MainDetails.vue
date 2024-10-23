<template>
  <div class="container">
    <div class="mt-4 d-flex align-items-center mb-2">
      <router-link :to="{ name: 'OrdersTable' }" class="btn btn-secondary me-3">
        <svg-icon type="mdi" :path="path" class="me-1" />
        Назад к заказам
      </router-link>
    </div>

    <OrderInfoCard :header="header" />

    <!-- Таблица деталей -->
    <DetailsTable
      :fields="filteredTableFields"
      :data="nomtable"
      :rowLink="true"
      :linkPath="
        (row) => ({ name: 'OrderDetails', params: { orderId: row.id } })
      "
      tableTitle="Информация о заказе"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DetailsTable from '@/modules/shared/data-table/BaseTable.vue' // Импорт компонента
import { getOrderById } from '../api/orders.js'
import OrderInfoCard from './HeaderCardInfo.vue'
import _ from 'lodash'
import { useRoleStore } from '../../main/store/index.js'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeft } from '@mdi/js'

const router = useRouter()
const roleStore = useRoleStore()

const nomtable = ref([])
const header = ref([])
const tableFields = ref([])

const path = mdiArrowLeft

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

const filteredTableFields = computed(() => {
  const fields = _.filter(
    tableFields.value,
    (field) => !field.name.startsWith('status_')
  )
  fields.unshift({ name: 'statuses', title: 'Статусы' })
  return fields
})

onMounted(() => {
  fetchOrderData()
})
</script>
