<template>
  <div class="row mb-3">
    <div class="col-md-6">
      <label for="singleDate" class="form-label">Выберите дату:</label>
      <div class="input-group">
        <Datepicker
            id="singleDate"
            v-model="selectedDate"
            :enableTimePicker="false"
            :format="dateFormat"
            :locale="customRuLocale"
            :calendar-class="'custom-calendar'"
            :clearable="true"
            class="form-control bi bi-x btn btn-outline-secondary"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vue3-datepicker';
import { ref } from 'vue';
import customRuLocale from './custom-ru.js';

export default {
  components: {
    Datepicker,
  },
  setup() {
    const selectedDate = ref(new Date());
    const dateFormat = 'dd.MM.yyyy';

    const clearDate = () => {
      selectedDate.value = null;
    };

    return {
      selectedDate,
      dateFormat,
      customRuLocale,
      clearDate,
    };
  },
};
</script>

<style scoped>
/* Добавьте стили, если необходимо */
.custom-calendar {
  /* Добавьте стили для календаря, если необходимо */
}
</style>