<template>
  <ag-grid-vue
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :pagination="true"
      :paginationPageSize="10"
      style="width: 100%; height: 500px;"
  ></ag-grid-vue>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default {
  name: "MyComponent",
  components: { AgGridVue },
  data() {
    return {
      columnDefs: [
        {headerName: 'ID', field: 'id'},
        {headerName: 'Name', field: 'name'},
      ],
      rowData: [
        {id: 1, name: 'Example 1'},
        {id: 2, name: 'Example 2'},
      ],
    };
  },
};
</script>
