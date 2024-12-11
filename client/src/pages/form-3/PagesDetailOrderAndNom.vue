<template>
  <div class="grid-container bg">
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
        v-if="selectedOrder?.header"
        :updateFormFields="updateFormFields"
        :readonlyFormFields="readonlyFormFields"
        :fieldValues="fieldValues"
      />
    </div>

    <div class="table-section">
      <CaliberTable
        v-if="selectedOrder?.table_cal?.data?.length"
        :fields="uniqueTableFields"
        :data="selectedOrder.table_cal?.data"
        :tableTitle="selectedOrder.table_cal?.title"
        :excluded="['id']"
      />
      <StrategyTable
        v-if="selectedOrder?.strat?.data?.length && !selectedOrder.strat?.error"
        :fields="uniqueTableFieldsStrat"
        :data="selectedOrder.strat?.data"
        :tableTitle="selectedOrder.strat?.title"
        :excluded="['ordersnom_id', 'op_id', 'pokr_id', 'id', 'nom_id']"
      />
      <TpdTable
        v-if="selectedOrder?.tpd?.data?.length && !selectedOrder.tpd?.error"
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
import { getModalOrderAndNomsById } from './api/nom_info.js'
import { useRoleStore } from '@/modules/_main/store/index.js'
import Card from '../../modules/form-3-nom/components/Form3Card.vue'
import CaliberTable from '@/modules/shared/tables/table/BaseTable.vue'
import StrategyTable from '@/modules/shared/tables/table/BaseTable.vue'
import TpdTable from '@/modules/shared/tables/table/BaseTable.vue'
import { filterFieldPermissions } from '@/utils/filterFieldPermissions.js'

const roleStore = useRoleStore()
const route = useRoute()
const id = ref(route.params.id)
const selectedOrder = ref(null)
const routeProps = defineProps(['type'])

// Загружаем данные заказа при монтировании компонента
onMounted(async () => {
  if (id.value) {
    try {
      selectedOrder.value = await getModalOrderAndNomsById(
        id.value,
        routeProps.type,
        roleStore.selectedRole
      )
    } catch (error) {
      console.error('Ошибка при загрузке деталей заказа:', error)
      selectedOrder.value = null
    }
  }
})

// Фильтрация полей заголовка с использованием filterFieldPermissions
const filteredHeaderFields = computed(() => {
  const fields = selectedOrder.value?.header?.fields || {}
  const filteredFields = Object.entries(filterFieldPermissions(fields)).map(
    ([fieldName, fieldProps]) => ({ name: fieldName, ...fieldProps })
  )
  return filteredFields
})

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
      selectedOrder.value?.header?.data[0][field.name] ?? '', // Заменяем null на пустую строку
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
  gap: 4px;
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
