<template>
  <div class="grid-container bg">
    <!-- Левая колонка: Карточка с информацией -->
    <div>
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
          selectedOrder?.table_cal?.data &&
          selectedOrder?.table_cal?.data.length
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
import CaliberTable from '@/modules/shared/tables/table/BaseTable.vue'
import StrategyTable from '@/modules/shared/tables/table/BaseTable.vue'
import TpdTable from '@/modules/shared/tables/table/BaseTable.vue'

const roleStore = useRoleStore()
const route = useRoute()
const idOrder = ref(route.params.idOrder)
const selectedOrder = ref(null)

const fetchOrderData = async () => {
  if (idOrder.value) {
    try {
      selectedOrder.value = await getModalOrderById(
        idOrder.value,
        'orders',
        roleStore.selectedRole
      )
    } catch (error) {
      console.error('Ошибка при загрузке деталей заказа:', error)
      selectedOrder.value = null
    }
  }
}

// Загружаем данные заказа при монтировании компонента
onMounted(fetchOrderData)

// Фильтрация полей заголовка
const filteredHeaderFields = computed(() =>
  Object.entries(selectedOrder.value?.header?.fields || {}).map(
    ([fieldName, fieldProps]) => ({ name: fieldName, ...fieldProps })
  )
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
  grid-template-columns: 400px 1fr;
  gap: 16px;
}

.table-section {
  width: 100%;
}

.card-body {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}
</style>
