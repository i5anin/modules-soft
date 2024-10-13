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
        {{headers}}
        <UniversalTable
          ref="ordersTable"
          :headers="headers"
          :data="tableData"
          :options="tableOptions"
          class="display"
          width="100%"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DateRangeFilter from '../form-1-orders-table/DateRangeFilter.vue';
import UniversalTable from "@/components/DataTable/UniversalTable.vue";
import { computed, ref, watch } from 'vue';
import { getOrders } from '../../api/orders.js';

export default {
  components: { UniversalTable, DateRangeFilter },
  setup() {
    const headers = ref([]);
    const tableData = ref([]);
    const response = ref(null);
    const ordersTable = ref(null); // Ref to access the DataTable instance

    const startDate = ref(new Date().toISOString().substr(0, 10));
    const endDate = ref(new Date().toISOString().substr(0, 10));

    const fetchOrders = async () => {
      try {
        const apiResponse = await getOrders(1, 15, '', null, null, startDate.value, endDate.value);
        response.value = apiResponse;

        if (apiResponse) {
          console.log(apiResponse)
          headers.value = apiResponse;
          tableData.value = apiResponse;
        } else {
          console.error("API response does not have the expected 'table.data' structure:", apiResponse);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    watch([startDate, endDate], fetchOrders);

    const tableOptions = computed(() => ({
      select: true,
      pageLength: 15,
      processing: true,
      serverSide: true,
      ajax: fetchOrders // Pass the function reference
    }));

    return {
      headers,
      tableData,
      startDate,
      endDate,
      response,
      tableOptions,
      ordersTable, // Expose the ref
    };
  },
};
</script>