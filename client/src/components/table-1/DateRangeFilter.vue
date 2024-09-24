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
            class="form-control"
        >
        </Datepicker>
        <font-awesome-icon :icon="['fas', 'xmark']"/>
      </div>
      <p v-if="selectedDate">Выбранная дата: {{ formattedDate }}</p>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vue3-datepicker';
import {computed, ref} from 'vue';
import customRuLocale from './custom-ru.js';
import {FontAwesomeIcon} from './fontawesome';

export default {
  components: {
    Datepicker,
    FontAwesomeIcon
  },
  setup() {
    const selectedDate = ref(null);
    const dateFormat = 'dd.MM.yyyy';

    const formattedDate = computed(() => {
      if (!selectedDate.value) return '';
      const day = selectedDate.value.getDate().toString().padStart(2, '0');
      const month = (selectedDate.value.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.value.getFullYear();
      return `${day}.${month}.${year}`;
    });

    const clearDate = () => {
      selectedDate.value = null
    }

    return {
      selectedDate,
      dateFormat,
      customRuLocale,
      formattedDate,
      clearDate
    };
  },
};
</script>