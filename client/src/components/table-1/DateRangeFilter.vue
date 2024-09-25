<template>
  <div class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text">
        <font-awesome-icon :icon="['far', 'calendar']" />
      </span>
    </div>
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
</template>

<script>
import Datepicker from 'vue3-datepicker';
import {computed, ref, watch} from 'vue';
import customRuLocale from '../shared/custom-ru.js';
import {FontAwesomeIcon} from '../shared/fontawesome.js';

export default {
  components: {
    Datepicker,
    FontAwesomeIcon
  },
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const selectedDate = ref(props.modelValue ? new Date(props.modelValue) : null);
    const dateFormat = 'dd.MM.yyyy';

    const formattedDate = computed(() => {
      if (!selectedDate.value) return '';
      const day = selectedDate.value.getDate().toString().padStart(2, '0');
      const month = (selectedDate.value.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.value.getFullYear();
      return `${day}.${month}.${year}`;
    });

    const clearDate = () => {
      selectedDate.value = null;
      emit('update:modelValue', null);
    };

    watch(selectedDate, (newDate) => {
      if (newDate) {
        const formatted = newDate.toISOString().split('T')[0];
        emit('update:modelValue', formatted);
      } else {
        emit('update:modelValue', null);
      }
    });

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

<style scoped>
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

.input-group-prepend {
  margin-right: 0.5rem;
}

.input-group-text {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>