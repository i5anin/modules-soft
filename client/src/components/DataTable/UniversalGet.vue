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
            :headers="headers"
            :data="tableData"
            :options="tableOptions"
            class="display"
            width="100%"
        />
      </div>
    </div>
    <pre>{{ response }}</pre>
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

    // Placeholder for formatValue function (you'll need to implement this)
    const formatValue = (value, fieldName) => {
      // Add your logic to format values based on the field name
      return value;
    };

    const fetchOrders = async (data, callback, settings) => {
      try {
        const page = (settings._iDisplayStart / settings._iDisplayLength) + 1;
        const limit = settings._iDisplayLength;
        const searchQuery = settings.oPreviousSearch.sSearch || '';
        const sortCol = settings.aaSorting.length ? settings.aoColumns[settings.aaSorting[0][0]].data : null;
        const sortDir = settings.aaSorting.length ? settings.aaSorting[0][1] : null;

        const apiResponse = await getOrders(page, limit, searchQuery, sortCol, sortDir, startDate.value, endDate.value);
        response.value = apiResponse;

        if (apiResponse.table && Array.isArray(apiResponse.table.data)) {
          headers.value = apiResponse.table.fields.map(field => field.title);

          // Format data before assigning to tableData
          tableData.value = apiResponse.table.data.map(order => {
            const formattedOrder = {};
            apiResponse.table.fields.forEach(field => {
              formattedOrder[field.name] = formatValue(order[field.name], field.name);
            });
            return formattedOrder;
          });

          callback({
            draw: settings.iDraw,
            recordsTotal: apiResponse.table.recordsTotal,
            recordsFiltered: apiResponse.table.recordsFiltered,
            data: tableData.value // Pass the formatted data to DataTables
          });
        } else {
          console.error("API response does not have the expected 'table.data' structure:", apiResponse);
          // Handle the error appropriately (display message, set tableData = [], etc.)
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        // Handle error appropriately
      }
    };

    const tableOptions = computed(() => ({
      select: true,
      pageLength: 15,
      processing: true,
      serverSide: true,
      ajax: fetchOrders // Pass the function reference
    }));

    watch([startDate, endDate], () => {
      if (ordersTable.value) {
        ordersTable.value.table.ajax.reload();
      }
    });

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