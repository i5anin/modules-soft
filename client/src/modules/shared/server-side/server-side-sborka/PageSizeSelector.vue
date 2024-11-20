<template>
  <div class="d-flex align-items-center me-3">
    <label class="me-2">Показать на странице:</label>
    <select
      :value="modelValue"
      class="form-select w-auto"
      @change="handleChange"
    >
      <option v-for="size in pageSizes" :key="size" :value="size">
        {{ size }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    pageSizes: { type: Array, required: true },
    modelValue: { type: Number, required: true },
  },
  emits: ['update:modelValue', 'page-size-change'],
  methods: {
    handleChange(event) {
      const newValue = parseInt(event.target.value, 10)
      this.$emit('update:modelValue', newValue)
      this.$emit('page-size-change', newValue)
    },
  },
}
</script>
