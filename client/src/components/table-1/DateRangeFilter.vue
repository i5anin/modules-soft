<template>
  <div class="row mb-3">
    <div class="col-md-6">
      <label for="singleDate" class="form-label">Выберите дату:</label>
      <Datepicker
          id="singleDate"
          v-model="selectedDate"
          :enableTimePicker="false"
          :format="dateFormat"
          :locale="ruLocale"
          :calendar-class="'custom-calendar'"
          :clearable="true"
      />
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import moment from 'moment';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'bootstrap-daterangepicker';
import localeSettings from './daterangepicker-locale.js';
import Datepicker from 'vue3-datepicker';
import { ref } from 'vue';
import { ru } from 'date-fns/locale';

export default {
  components: {
    Datepicker,
  },
  setup() {
    const selectedDate = ref(new Date());
    const dateFormat = 'dd.MM.yyyy';
    const ruLocale = ru;

    return {
      selectedDate,
      dateFormat,
      ruLocale,
    };
  },
  mounted() {
    this.initializeDateRangePicker();
  },
  methods: {
    initializeDateRangePicker() {
      // Убедитесь, что moment импортирован и используется правильно
      console.log(typeof moment); // Проверка, что moment доступен и является функцией

      $('input[name="daterange"]').daterangepicker({
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

<style scoped>
/* Добавьте стили, если необходимо */
.custom-calendar {
  /* Добавьте стили для календаря, если необходимо */
}
</style>