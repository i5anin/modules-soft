<template>
  <div class="input-group">
    <span class="input-group-text">
      <font-awesome-icon :icon="['far', 'calendar']" />
    </span>
    <Datepicker
      id="singleDate"
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
import { ref, watch } from 'vue'
import customRuLocale from '@/utils/localize-ru.ts'
import { FontAwesomeIcon } from '@/utils/icons.ts'

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
    const dateFormat = 'dd.MM.yyyy'

    // Парсинг даты без UTC-сдвига
    const parseDateToLocal = (dateString) => {
      if (!dateString) return null
      const [year, month, day] = dateString.split('-')
      return new Date(year, month - 1, day) // Создаёт дату в локальном времени
    }

    // Форматирование даты в формат 'YYYY-MM-DD'
    const formatDateToISO = (date) => {
      if (!date) return null
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const selectedDate = ref(
      props.modelValue ? parseDateToLocal(props.modelValue) : null
    )

    const clearDate = () => {
      selectedDate.value = null
    }

    watch(selectedDate, (newDate) => {
      const formattedDate = formatDateToISO(newDate)
      emit('update:modelValue', formattedDate)
    })

    return {
      selectedDate,
      dateFormat,
      customRuLocale,
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
