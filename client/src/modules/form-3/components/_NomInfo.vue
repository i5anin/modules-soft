<template>
  <div class="container">
    <router-link :to="{ name: 'OrdersTable' }" class="btn btn-secondary me-3">
      Назад к заказам
    </router-link>

    <h1>Детали заказа</h1>

    <div v-if="selectedOrder && fields.length">
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

      <OrderTable
        v-if="selectedOrder.table"
        :fields="uniqueTableFields"
        :data="selectedOrder.table.data"
        :tableTitle="selectedOrder.table.title"
      />
    </div>
    <div v-else-if="!selectedOrder">
      <p>Загрузка данных...</p>
    </div>
    <div v-else>
      <p>Нет доступных полей для отображения.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { getModalOrderById } from '../api/orders.js'
import OrderTable from './OrderTable.vue'

const props = defineProps({
  orderId: { type: Number, required: true },
  fields: { type: Array, required: true },
})

const selectedOrder = ref(null)

watch(
  () => props.orderId,
  async (orderId) => {
    if (orderId) {
      try {
        selectedOrder.value = await getModalOrderById(orderId)
      } catch (error) {
        console.error('Ошибка при загрузке деталей заказа:', error)
        selectedOrder.value = null
      }
    }
  },
  { immediate: true }
)

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
  const fields = selectedOrder.value?.table?.fields || []
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
