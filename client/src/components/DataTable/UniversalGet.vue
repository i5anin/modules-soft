<!-- UniversalGet.vue -->
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
            ref="ordersTable"
            :url-data="getOrdersUrl"
            :start-date="startDate"
            :end-date="endDate"
            class="display"
            width="100%"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getOrders } from '../../api/orders.js'
import DateRangeFilter from '../form-1-orders-table/DateRangeFilter.vue'
import UniversalTable from '@/components/DataTable/UniversalTable.vue'

const startDate = ref(null)
const endDate = ref(null)

const getOrdersUrl = (page, pageSize, search, orderColumn, orderDirection, startDate, endDate) => {
  return getOrders(page, pageSize, search, orderColumn, orderDirection, startDate, endDate)
}
</script>

<style scoped>
.container-fluid {
  padding: 15px;
}

.date-range-filters {
  margin-bottom: 15px;
}
</style>
