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
            :headers="headers"
            :data="data"
            :options="{ select: true, pageLength: 15, processing: true, serverSide: true }"
            class="display"
            width="100%"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DateRangeFilter from '../form-1-orders-table/DateRangeFilter.vue';
import { ref, onMounted, watch } from 'vue';
import { getOrders } from '../../api/orders.js';
import UniversalTable from "@/components/DataTable/UniversalTable.vue";

export default {
  components: { UniversalTable, DateRangeFilter },
  setup() {
    const headers = ref(['Column A', 'Column B']);
    const data = ref([]);

    const startDate = ref(null);
    const endDate = ref(null);

    const fetchOrders = async () => {
      try {
        const response = await getOrders(1, 15, '', null, null, startDate.value, endDate.value);
        data.value = response.table.data.map(order => [
          order.field1, // Замените на реальные поля из ответа
          order.field2,
        ]);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    onMounted(fetchOrders);
    watch([startDate, endDate], fetchOrders);

    return {
      headers,
      data,
      startDate,
      endDate,
    };
  },
};
</script>
