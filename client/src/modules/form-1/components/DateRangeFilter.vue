<template>
  <div class="input-group">
    <span class="input-group-text">
      <font-awesome-icon :icon="['far', 'calendar']"
    /></span>
    <Datepicker
      id="singleDate"
      :value="formattedDate"
      v-model="selectedDate"
      :enableTimePicker="false"
      :format="dateFormat"
      :locale="customRuLocale"
      :calendar-class="'custom-calendar'"
      :clearable="false"
      class="form-control"
    />
    <button
      v-if="selectedDate"
      type="button"
      class="btn btn-secondary"
      @click="clearDate"
    >
      <font-awesome-icon :icon="['fas', 'xmark']" />
    </button>
  </div>
</template>

<script>
import Datepicker from 'vue3-datepicker'
import { computed, ref, watch } from 'vue'
import customRuLocale from '@/utils/localize-ru.js'
import { FontAwesomeIcon } from '@/utils/icons.js'

export default {
  components: {
    Datepicker,
    FontAwesomeIcon,
  },
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectedDate = ref(
      props.modelValue ? new Date(props.modelValue) : null
    )
    const dateFormat = 'dd.MM.yyyy'

    //  Форматируем дату для отображения в Datepicker
    const formattedDate = computed(() => {
      return selectedDate.value
        ? selectedDate.value.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : ''
    })

    const clearDate = () => {
      selectedDate.value = null
    }

    watch(selectedDate, (newDate) => {
      // Эмиттим событие обновления модели с отформатированной датой
      emit(
        'update:modelValue',
        newDate ? newDate.toISOString().split('T')[0] : null
      )
    })

    return {
      selectedDate,
      dateFormat,
      customRuLocale,
      formattedDate,
      clearDate,
    }
  },
}
</script>

<style scoped>
.input-group-text {
  align-items: center;
  display: flex;
}
</style>
