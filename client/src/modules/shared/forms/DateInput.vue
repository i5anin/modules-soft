<template>
  <div class="input-group">
    <span class="input-group-text">
      <font-awesome-icon :icon="['far', 'calendar']" />
    </span>
    <Datepicker
      id="singleDate"
      v-model="localDate"
      :enableTimePicker="false"
      :format="dateFormat"
      :locale="customRuLocale"
      :calendar-class="'custom-calendar'"
      :clearable="false"
      class="form-control"
    />
    <button
      v-if="localDate"
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
    const dateFormat = 'dd.MM.yyyy'
    const localDate = ref(props.modelValue ? new Date(props.modelValue) : null)

    const clearDate = () => {
      localDate.value = null
    }

    watch(
      () => props.modelValue,
      (newValue) => {
        localDate.value =
          typeof newValue === 'string' ? new Date(newValue) : null
      }
    )

    watch(localDate, (newValue) => {
      emit(
        'update:modelValue',
        newValue ? newValue.toISOString().split('T')[0] : null
      )
    })

    return {
      localDate,
      dateFormat,
      customRuLocale,
      clearDate,
    }
  },
}
</script>
