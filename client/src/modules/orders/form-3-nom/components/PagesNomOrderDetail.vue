<template>
  <div class="grid-container bg">
    <!-- Левая колонка: Карточка с информацией -->
    <div class="p-2">
      <BackButton targetRoute="OrderDetails" />
      <div class="d-flex align-items-center mb-2">
        <svg-icon
          type="mdi"
          :path="mdiBolt"
          class="me-1"
          color="red"
          :size="32"
        />
        <h6 class="m-0">Информация по номенклатуре</h6>
      </div>

      <Card
        v-if="selectedOrder && selectedOrder.header"
        :updateFormFields="updateFormFields"
        :readonlyFormFields="readonlyFormFields"
        :fieldValues="fieldValues"
      />
    </div>

    <!-- Правая колонка: Таблицы -->
    <div class="table-section">
      <!-- Таблица данных по калибрам -->
      <CaliberTable
        v-if="
          selectedOrder &&
          !selectedOrder.table_cal?.error &&
          selectedOrder.table_cal?.data?.length
        "
        :fields="uniqueTableFields"
        :data="selectedOrder.table_cal?.data"
        :tableTitle="selectedOrder.table_cal?.title"
        :excluded="['id']"
      />

      <!-- Таблица данных по стратегии -->
      <StrategyTable
        v-if="
          selectedOrder &&
          !selectedOrder.strat?.error &&
          selectedOrder.strat?.data?.length
        "
        :fields="uniqueTableFieldsStrat"
        :data="selectedOrder.strat?.data"
        :tableTitle="selectedOrder.strat?.title"
        :excluded="['ordersnom_id', 'op_id', 'pokr_id', 'id', 'nom_id']"
      />

      <!-- Таблица данных по TPD -->
      <TpdTable
        v-if="
          selectedOrder &&
          !selectedOrder.tpd?.error &&
          selectedOrder.tpd?.data?.length
        "
        :fields="uniqueTableFieldsTpd"
        :data="selectedOrder.tpd?.data"
        :tableTitle="selectedOrder.tpd?.title"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiBolt } from '@mdi/js'
import { getModalOrderById } from '../api/nom_info.js'
import { useRoleStore } from '@/modules/_main/store/index.js'
import Card from './Card.vue'
import CaliberTable from '@/modules/shared/table/data-table/BaseTable.vue'
import StrategyTable from '@/modules/shared/table/data-table/BaseTable.vue'
import TpdTable from '@/modules/shared/table/data-table/BaseTable.vue'
import BackButton from '@/modules/shared/BackButton.vue'

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

// Исключенные поля для отображения
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

// Фильтрация полей заголовка с учетом новой структуры данных
const filteredHeaderFields = computed(() =>
  Object.entries(selectedOrder.value?.header?.fields || {})
    .filter(([fieldName]) => !excludedFields.includes(fieldName))
    .map(([fieldName, fieldProps]) => ({ name: fieldName, ...fieldProps }))
)

const updateFormFields = computed(() =>
  filteredHeaderFields.value.filter(
    (field) => field.permissions.update === true
  )
)

const readonlyFormFields = computed(() =>
  filteredHeaderFields.value.filter(
    (field) => field.permissions.update !== true
  )
)

// Преобразование значений полей в объект
const fieldValues = computed(() =>
  Object.fromEntries(
    filteredHeaderFields.value.map((field) => [
      field.name,
      selectedOrder.value?.header?.data[0][field.name],
    ])
  )
)

// Уникальные поля для каждой таблицы (без дублирования)
const uniqueFields = (fields) => {
  const seen = new Set()
  return Object.entries(fields || {})
    .filter(([fieldName]) => {
      if (seen.has(fieldName)) return false
      seen.add(fieldName)
      return true
    })
    .map(([fieldName, fieldProps]) => ({ name: fieldName, ...fieldProps }))
}

const uniqueTableFields = computed(() =>
  uniqueFields(selectedOrder.value?.table_cal?.fields)
)
const uniqueTableFieldsStrat = computed(() =>
  uniqueFields(selectedOrder.value?.strat?.fields)
)
const uniqueTableFieldsTpd = computed(() =>
  uniqueFields(selectedOrder.value?.tpd?.fields)
)
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 400px 1fr; /* Фиксированная ширина слева и адаптивная справа */
  gap: 16px;
}

.table-section {
  width: 100%; /* Занимает оставшееся пространство справа */
}

.card-body {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}
</style>
