<!-- components/SearchBar.vue -->
<template>
  <div class="search-bar d-flex align-items-center">
    <label class="me-2">Поиск:</label>
    <div class="position-relative">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control me-2 search-input"
        placeholder="Введите текст для поиска"
        :disabled="loading"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="btn btn-link position-absolute top-50 end-0 translate-middle-y"
        style="padding: 0; color: gray"
      >
        <i class="bi bi-x-circle me-3"></i>
      </button>
    </div>
    <button @click="onSearch" class="btn btn-primary" :disabled="loading">
      Поиск
    </button>
    <div v-if="loading" class="spinner-border ms-2" role="status">
      <span class="visually-hidden">Загрузка...</span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SearchBar',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['search-change'],
  setup(props, { emit }) {
    const searchQuery = ref('')

    const onSearch = () => {
      emit('search-change', searchQuery.value)
    }

    const clearSearch = () => {
      searchQuery.value = ''
      emit('search-change', '')
    }

    return {
      searchQuery,
      onSearch,
      clearSearch,
    }
  },
}
</script>

<style scoped>
.search-bar .search-input {
  width: 300px;
}
</style>
