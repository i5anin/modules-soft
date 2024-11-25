<template>
  <div class="d-flex justify-content-between align-items-center">
    <p class="text-muted mb-0">
      {{ startRecord }}–{{ endRecord }} из {{ totalCount }}
    </p>

    <nav aria-label="Page navigation">
      <ul class="pagination mb-0">
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
          @click="goToPage(1)"
        >
          <button class="page-link" type="button">«</button>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
          @click="goToPage(currentPage - 1)"
        >
          <button class="page-link" type="button">‹</button>
        </li>
        <li class="page-item active">
          <span class="page-link">{{ currentPage }}</span>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
          @click="goToPage(currentPage + 1)"
        >
          <button class="page-link" type="button">›</button>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
          @click="goToPage(totalPages)"
        >
          <button class="page-link" type="button">»</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Pagination',
  props: {
    totalCount: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ['page-change'],
  setup(props, { emit }) {
    const startRecord = computed(
      () => (props.currentPage - 1) * props.itemsPerPage + 1
    )
    const endRecord = computed(() =>
      Math.min(props.currentPage * props.itemsPerPage, props.totalCount)
    )

    const goToPage = (page) => {
      if (page < 1) page = 1
      if (page > props.totalPages) page = props.totalPages
      emit('page-change', page)
    }

    return {
      startRecord,
      endRecord,
      goToPage,
    }
  },
}
</script>

<style scoped>
.pagination .page-item.disabled .page-link {
  cursor: not-allowed;
}
</style>
