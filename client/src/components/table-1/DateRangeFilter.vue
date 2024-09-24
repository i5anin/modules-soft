<template>
  <div class="row mb-3">
    <div class="col-md-6">
      <label for="dateRange" class="form-label">Выберите диапазон дат:</label>
      <input type="text" class="form-control" id="dateRange" />
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'bootstrap-daterangepicker';
import localeSettings from './daterangepicker-locale.js';

export default {
  mounted() {
    this.initializeDateRangePicker();
  },
  methods: {
    initializeDateRangePicker() {
      $('#dateRange').daterangepicker({
        showDropdowns: true,
        autoApply: true,
        locale: localeSettings,
        linkedCalendars: false,
        showCustomRangeLabel: false,
        opens: 'left'
      }, (start, end) => {
        console.log('Выбранный диапазон:', start.format('YYYY-MM-DD'), 'до', end.format('YYYY-MM-DD'));
      });
    },
  },
};
</script>