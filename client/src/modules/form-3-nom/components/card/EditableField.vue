<template>
  <div>
    <div
      v-if="isTextarea"
      class="form-floating"
    >
      <textarea
        :id="`floatingTextarea-${field.name}`"
        :value="modelValue"
        :placeholder="field.title"
        class="form-control form-control-sm"
        :style="{ height: calculateHeight(String(modelValue)) + 'px' }"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
      <label :for="`floatingTextarea-${field.name}`">{{ field.title }}</label>
    </div>
    <div
      v-else-if="isCheckbox"
      class="form-check form-switch d-inline-block me-3"
    >
      <input
        :id="`switch-${field.name}`"
        type="checkbox"
        :checked="modelValue"
        class="form-check-input"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <label
        class="form-check-label"
        :for="`switch-${field.name}`"
      >
        {{ field.title }}
      </label>
    </div>
    <div
      v-else
      class="form-floating"
    >
      <input
        :id="`floatingInput-${field.name}`"
        type="text"
        :value="String(modelValue)"
        :placeholder="field.title"
        class="form-control form-control-sm"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <label :for="`floatingInput-${field.name}`">{{ field.title }}</label>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { calculateHeight } from '../../utils/calculateHeight.js'
  import '@/assets/FormFloatingField.css'

  const props = defineProps({
    field: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: [String, Boolean, Number],
      required: true,
    },
  })

  const isTextarea = computed(() => String(props.modelValue).length >= 40)
  const isCheckbox = computed(() => typeof props.modelValue === 'boolean')
</script>
