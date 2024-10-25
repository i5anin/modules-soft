<template>
  <div class="container">
    <router-link :to="{ name: 'OrderDetails' }" class="btn btn-secondary me-3">
      Назад к списку деталей заказа
    </router-link>

    <h3 class="mb-4">
      <svg-icon
        type="mdi"
        :path="mdiBolt"
        class="me-1"
        color="red"
        :size="32"
      />
      Информация по номенклатуре
    </h3>

    <div v-if="selectedOrder">
      <div v-if="selectedOrder.header" class="card">
        <div class="card-body">
          <div class="row">
            <ColumnDisplay
              :fields="leftColumnFields"
              :data="selectedOrder.header.data[0]"
            />
            <ColumnDisplay
              :fields="rightColumnFields"
              :data="selectedOrder.header.data[0]"
            />
          </div>
        </div>
      </div>
      <CaliberTable
        v-if="selectedOrder.table_cal"
        :fields="uniqueTableFields"
        :data="formatData(selectedOrder.table_cal.data, uniqueTableFields)"
        :tableTitle="selectedOrder.table_cal.title"
      />
      <Strategy
        v-if="selectedOrder.strat"
        :fields="uniqueTableFieldsStrat"
        :data="formatData(selectedOrder.strat.data, uniqueTableFieldsStrat)"
        :tableTitle="selectedOrder.strat.title"
        :excluded="['ordersnom_id', 'op_id', 'pokr_id', 'id', 'nom_id']"
      />
    </div>
    <div v-else>
      <p>Загрузка данных...</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiBolt } from '@mdi/js'
import { getModalOrderById } from '../api/orders.js'
import { useRoleStore } from '@/modules/main/store/index.js'
import { formatValue } from '@/utils/formatters.js'
import CaliberTable from '@/modules/shared/data-table/BaseTable.vue'
import Strategy from '@/modules/shared/data-table/BaseTable.vue'
import ColumnDisplay from './ColumnDisplay.vue'

const roleStore = useRoleStore()
const route = useRoute()
const orderId = ref(route.params.orderId)
const id = ref(route.params.id)
const selectedOrder = ref(null)

const fetchOrderData = async () => {
  if (id.value) {
    try {
      selectedOrder.value = await getModalOrderById(
        id.value,
        roleStore.selectedTypes,
        roleStore.selectedRole
      )
    } catch (error) {
      console.error('Ошибка при загрузке деталей заказа:', error)
      selectedOrder.value = null
    }
  }
}

onMounted(fetchOrderData)

const filteredHeaderFields = computed(
  () =>
    selectedOrder.value?.header?.fields.filter(
      (field) => field.name !== 'nom_id_nom'
    ) || []
)

const leftColumnFields = computed(() => {
  const fields = filteredHeaderFields.value
  const half = Math.ceil(fields.length / 2)
  return fields.slice(0, half)
})

const rightColumnFields = computed(() => {
  const fields = filteredHeaderFields.value
  const half = Math.ceil(fields.length / 2)
  return fields.slice(half)
})

const uniqueFields = (fields) => {
  const seen = new Set()
  return fields.filter((field) => !seen.has(field.name) && seen.add(field.name))
}

const uniqueTableFields = computed(() =>
  uniqueFields(selectedOrder.value?.table_cal?.fields || [])
)
const uniqueTableFieldsStrat = computed(() =>
  uniqueFields(selectedOrder.value?.strat?.fields || [])
)

const formatData = (data, fields) =>
  data.map((row) =>
    fields.reduce((acc, field) => {
      acc[field.name] = formatValue(row[field.name], field.name)
      return acc
    }, {})
  )
</script>
