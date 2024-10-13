<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="date-range-filters d-flex align-items-center justify-content-start">
          <div class="d-flex align-items-center">
            <label for="start-date" class="form-label fw-bold me-2 mb-0">С</label>
            <DateRangeFilter
              id="start-date"
              class="custom-date-range-filter flex-grow-1"
              v-model="startDate"
            />
          </div>
          <div class="d-flex align-items-center ms-3">
            <label for="end-date" class="form-label fw-bold me-2 mb-0">По</label>
            <DateRangeFilter
              id="end-date"
              class="custom-date-range-filter flex-grow-1"
              v-model="endDate"
            />
          </div>
        </div>

        <UniversalTable
          v-if="dataLoaded"
          ref="ordersTable"
          :info="info"
          :fields="fields"
          :data-table="dataTable"
          class="display"
          width="100%"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import DateRangeFilter from '../form-1-orders-table/DateRangeFilter.vue'
import UniversalTable from '@/components/DataTable/UniversalTable.vue'
import { ref, watch, onMounted } from 'vue'
import debounce from 'lodash/debounce'
import { getOrders } from '../../api/orders.js'

const startDate = ref(null)
const endDate = ref(null)

let info = ref([])
let fields = ref([])
let dataTable = ref([])
let dataLoaded = ref(false) // Флаг для контроля загрузки данных

// Функция для загрузки данных таблицы с сервера
const loadOrders = async () => {
  try {
    dataLoaded.value = false // Сбрасываем флаг перед загрузкой данных
    const response = await getOrders(1, 15, '', null, null, startDate.value, endDate.value)
    console.log(response)

    info.value = response.header
    fields.value = response.table.fields
    dataTable.value = response.table.data

    dataLoaded.value = true // Устанавливаем флаг после успешной загрузки данных
  } catch (error) {
    console.error('Ошибка загрузки данных заказов:', error)
  }
}

// Дебаунс для минимизации количества запросов к серверу
const debouncedLoadOrders = debounce(loadOrders, 500)

// Наблюдатели за датами, вызывающие загрузку данных при их изменении
watch([startDate, endDate], () => {
  debouncedLoadOrders()
})

// Начальная загрузка данных при монтировании компонента
onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.container-fluid {
  padding: 15px;
}

.date-range-filters {
  margin-bottom: 15px;
}
</style>
