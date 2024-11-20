<template>
  <div class="d-flex align-items-center me-3">
    <label class="me-2">Показать на странице:</label>
    <select
      :value="tableStore.itemsPerPage"
      class="form-select w-auto"
      @change="handleChange"
    >
      <option
        v-for="size in tableStore.itemsPerPageOptions"
        :key="size"
        :value="size"
      >
        {{ size }}
      </option>
    </select>
  </div>
</template>

<script>
import { useServerSideTableStore } from './stores/serverSideTable'

export default {
  setup() {
    const tableStore = useServerSideTableStore()

    const handleChange = (event) => {
      const newValue = parseInt(event.target.value, 10)
      tableStore.setItemsPerPage(newValue)
    }

    return {
      tableStore,
      handleChange,
    }
  },
}
</script>
