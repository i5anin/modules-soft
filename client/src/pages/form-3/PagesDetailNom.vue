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
        v-if="selectedItem?.header"
        :updateFormFields="updateFormFields"
        :readonlyFormFields="readonlyFormFields"
        :fieldValues="fieldValues"
      />
    </div>

    <div class="table-section">
      <CaliberTable
        v-if="selectedItem?.table_cal?.data?.length"
        :fields="uniqueTableFields"
        :data="selectedItem.table_cal?.data"
        :tableTitle="selectedItem.table_cal?.title"
      />
      <StrategyTable
        v-if="selectedItem?.strat?.data?.length"
        :fields="uniqueTableFieldsStrat"
        :data="selectedItem.strat?.data"
        :tableTitle="selectedItem.strat?.title"
      />
      <TpdTable
        v-if="selectedItem?.tpd?.data?.length"
        :fields="uniqueTableFieldsTpd"
        :data="selectedItem.tpd?.data"
        :tableTitle="selectedItem.tpd?.title"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiBolt } from '@mdi/js'
import { getNomDetailsById } from './api/nom_info.js'
import { useRoleStore } from '@/modules/_main/store/index.js'
import Card from '@/modules/form-3-nom/components/Form3Card.vue'
import BaseTable from '@/modules/shared/tables/table/BaseTable.vue'

import { processFields } from '@/utils/dev/fieldsProcessor.js'

const CaliberTable = BaseTable
const StrategyTable = BaseTable
const TpdTable = BaseTable
const roleStore = useRoleStore()
const route = useRoute()
const id = ref(route.params.nom_id)
const selectedItem = ref(null)
const routeProps = defineProps(['type'])

// Загружаем данные заказа при монтировании компонента
onMounted(async () => {
  if (id.value) {
    try {
      selectedItem.value = await getNomDetailsById(
        id.value,
        routeProps.type,
        roleStore.selectedRole
      )
    } catch (error) {
      console.error('Ошибка при загрузке деталей заказа:', error)
      selectedItem.value = null
    }
  }
})

// Уникальные поля
const uniqueFields = (fields) => {
  const seen = new Set()
  return Object.entries(fields || {})
    .filter(([fieldName]) => {
      if (seen.has(fieldName)) return false
      seen.add(fieldName)
      return true
    })
    .map(([fieldName, fieldProps]) => ({ key: fieldName, ...fieldProps }))
}

// Обработка полей через processFields
const processedFields = (fields) => {
  const unique = uniqueFields(fields)
  return processFields(unique)
}

// Вычисляемые свойства для таблиц
const uniqueTableFields = computed(() =>
  processedFields(selectedItem.value?.table_cal?.fields)
)
const uniqueTableFieldsStrat = computed(() =>
  processedFields(selectedItem.value?.strat?.fields)
)
const uniqueTableFieldsTpd = computed(() =>
  processedFields(selectedItem.value?.tpd?.fields)
)

// Поля заголовка
const filteredHeaderFields = computed(() => {
  const fields = selectedItem.value?.header?.fields || {}
  return Object.entries(fields).map(([key, fieldProps]) => ({
    key,
    ...fieldProps,
  }))
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
const fieldValues = computed(() => {
  const fields = selectedItem.value?.header?.fields || {}
  const data = selectedItem.value?.header?.data || {}
  return Object.fromEntries(
    Object.keys(fields).map((key) => [
      key,
      data[key] ?? '', // Заменяем null на пустую строку
    ])
  )
})
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
