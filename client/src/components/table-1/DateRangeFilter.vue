<template>
  <div class="row mb-3">
    <div class="col-md-6">
      <div class="input-group">
        <Datepicker
            id="singleDate"
            v-model="selectedDate"
            :enableTimePicker="false"
            :format="dateFormat"
            :value="formattedDate"
            :locale="customRuLocale"
            :calendar-class="'custom-calendar'"
            :clearable="false"
            class="form-control"
        />
        <button v-if="formattedDate" type="button" class="btn btn-secondary" @click="clearDate">
          <font-awesome-icon :icon="['fas', 'xmark']"/>
        </button>
      </div>
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

.input-group {
display: flex;
align-items: center;
}

.form-control {
flex: 1;
}

.btn {
margin-left: 0.5rem;
}
