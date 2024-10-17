<!-- _NomInfo.vue -->
<template>
  <div class="container">
    <router-link :to="{ name: 'OrderDetails' }" class="btn btn-secondary me-3">
      Назад к списку деталей заказа
    </router-link>

    <h1>Информация по номенклатуре (Деталь)</h1>

    <div v-if="selectedOrder">
      <div v-if="selectedOrder.header">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-6">
                <div
                  v-for="(field, index) in leftColumnFields"
                  :key="index"
                  class="mb-1"
                >
                  <strong>{{ field.title }}:</strong>
                  {{ selectedOrder.header.data[0][field.name] }}
                </div>
              </div>
              <div class="col-6">
                <div
                  v-for="(field, index) in rightColumnFields"
                  :key="index"
                  class="mb-1"
                >
                  <strong>{{ field.title }}:</strong>
                  {{ selectedOrder.header.data[0][field.name] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Добавляем проверки v-if -->
      <OrderTable
        v-if="selectedOrder.table_cal"
        :fields="uniqueTableFields"
        :data="selectedOrder.table_cal.data"
        :tableTitle="selectedOrder.table_cal.title"
      />
      <OrderTable
        v-if="selectedOrder.strat"
        :fields="uniqueTableFieldsStrat"
        :data="selectedOrder.strat.data"
        :tableTitle="selectedOrder.strat.title"
      />
    </div>
    <div v-else>
      <p>Загрузка данных...</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getModalOrderById } from '../api/orders.js'
import OrderTable from './OrderTable.vue'

const route = useRoute()
const orderId = ref(null)
const id = ref(null)
const selectedOrder = ref(null)

onMounted(async () => {
  orderId.value = route.params.orderId
  id.value = route.params.id
  if (id.value) {
    try {
      selectedOrder.value = await getModalOrderById(id.value)
      console.log('selectedOrder:', selectedOrder.value) // Логируем объект
    } catch (error) {
      console.error('Ошибка при загрузке деталей заказа:', error)
      selectedOrder.value = null
    }
  } else {
    console.error('Параметр id не найден в маршруте')
  }
})

const filteredHeaderFields = computed(() => {
  return (
    selectedOrder.value?.header?.fields.filter(
      (field) => field.name !== 'nom_id_nom'
    ) || []
  )
})

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

const uniqueTableFields = computed(() => {
  const fields = selectedOrder.value?.table_cal?.fields || []
  const uniqueFields = []
  const seen = new Set()

  fields.forEach((field) => {
    if (!seen.has(field.name)) {
      seen.add(field.name)
      uniqueFields.push(field)
    }
  })

  return uniqueFields
})

const uniqueTableFieldsStrat = computed(() => {
  console.log(uniqueTableFieldsStrat)
  const fields = selectedOrder.value?.strat?.fields || []
  const uniqueFields = []
  const seen = new Set()

  fields.forEach((field) => {
    if (!seen.has(field.name)) {
      seen.add(field.name)
      uniqueFields.push(field)
    }
  })

  return uniqueFields
})
</script>
