<template>
  <div class="container">
    <div style="display: flex; align-items: center; gap: 10px">
      <router-link
        :to="{ name: 'OrderDetails' }"
        class="btn btn-secondary me-3"
      >
        Назад к списку деталей заказа
      </router-link>

      <div class="d-flex align-items-center mb-4">
        <svg-icon
          type="mdi"
          :path="mdiBolt"
          class="me-1"
          color="red"
          :size="32"
        />
        <h4 class="m-0">Информация по номенклатуре</h4>
      </div>
    </div>

    <div v-if="selectedOrder">
      <Card
        v-if="selectedOrder.header"
        :leftColumnFields="leftColumnFields"
        :rightColumnFields="rightColumnFields"
        :fieldValues="fieldValues"
      />

      <!-- Таблица данных по калибрам -->
      <CaliberTable
        v-if="
          !selectedOrder.table_cal?.error &&
          selectedOrder.table_cal?.data?.length
        "
        :fields="uniqueTableFields"
        :data="formatData(selectedOrder.table_cal?.data, uniqueTableFields)"
        :tableTitle="selectedOrder.table_cal?.title"
      />

      <!-- Таблица данных по стратегии -->
      <StrategyTable
        v-if="!selectedOrder.strat?.error && selectedOrder.strat?.data?.length"
        :fields="uniqueTableFieldsStrat"
        :data="formatData(selectedOrder.strat?.data, uniqueTableFieldsStrat)"
        :tableTitle="selectedOrder.strat?.title"
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
import { formatValue, formatValueCard } from '@/utils/formatters.js'
import Card from './Card.vue'
import CaliberTable from '@/modules/shared/data-table/BaseTable.vue'
import StrategyTable from '@/modules/shared/data-table/BaseTable.vue'

const roleStore = useRoleStore()
const route = useRoute()
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

const excludedFields = [
  'zag_tech_material_id',
  'ordersnom__id',
  'zag_buy_p1',
  'zag_buy_p2',
  'zag_buy_p3',
  'zag_buy_p4',
  'zag_buy_weight',
  'nom_id_nom',
]

const filteredHeaderFields = computed(
  () =>
    selectedOrder.value?.header?.fields.filter(
      (field) => !excludedFields.includes(field.name)
    ) || []
)

const leftColumnFields = computed(() => {
  const fields = filteredHeaderFields.value.filter(
    (field) => field.edit === true
  )
  return fields
})

const rightColumnFields = computed(() => {
  const fields = filteredHeaderFields.value.filter(
    (field) => field.edit !== true
  )
  return fields
})

const fieldValues = computed(() =>
  Object.fromEntries(
    filteredHeaderFields.value.map((field) => [
      field.name,
      formatValueCard(
        selectedOrder.value?.header?.data[0][field.name],
        field.name
      ),
    ])
  )
)

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

const formatData = (data, fields) => {
  return data.map((row) =>
    fields.reduce((acc, field) => {
      acc[field.name] = formatValue(row[field.name], field.name)
      return acc
    }, {})
  )
}
</script>
