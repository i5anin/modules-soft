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
      <div v-if="selectedOrder.header" class="card mb-2">
        <div class="card-body p-2">
          <div class="row">
            <!-- Левая колонка -->
            <div class="col-md-6">
              <table class="table table-sm border-light">
                <tbody>
                  <tr v-for="field in leftColumnFields" :key="field.name">
                    <td class="p-1">
                      <strong>{{ field.title }}</strong>
                    </td>
                    <td class="p-1">
                      <input
                        type="text"
                        v-model="fieldValues[field.name]"
                        :placeholder="field.title"
                        class="form-control form-control-sm"
                        disabled
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Правая колонка -->
            <div class="col-md-6">
              <table class="table table-sm border-light">
                <tbody>
                  <tr v-for="field in rightColumnFields" :key="field.name">
                    <td class="p-1">
                      <strong>{{ field.title }}</strong>
                    </td>
                    <td class="p-1">
                      <input
                        type="text"
                        v-model="fieldValues[field.name]"
                        :placeholder="field.title"
                        class="form-control form-control-sm"
                        disabled
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Таблица данных по калибровке -->
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
      <Strategy
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
import { formatValue } from '@/utils/formatters.js'
import CaliberTable from '@/modules/shared/data-table/BaseTable.vue'
import Strategy from '@/modules/shared/data-table/BaseTable.vue'

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

// Поля, которые нужно исключить из отображения
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

// Фильтрованные поля заголовка
const filteredHeaderFields = computed(
  () =>
    selectedOrder.value?.header?.fields.filter(
      (field) => !excludedFields.includes(field.name)
    ) || []
)

// Разделение полей на левую и правую колонку
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

// Реактивное поле для значений
const fieldValues = computed(() =>
  Object.fromEntries(
    filteredHeaderFields.value.map((field) => [
      field.name,
      formatValue(selectedOrder.value?.header?.data[0][field.name], field.name),
    ])
  )
)

// Уникальные поля для таблиц данных
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

// Форматирование данных для отображения в таблицах
const formatData = (data, fields) => {
  return data.map((row) =>
    fields.reduce((acc, field) => {
      acc[field.name] = formatValue(row[field.name], field.name)
      return acc
    }, {})
  )
}
</script>
