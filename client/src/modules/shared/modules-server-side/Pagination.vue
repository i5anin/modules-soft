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
          <a class="page-link" href="javascript:void(0)">«</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
          @click="goToPage(currentPage - 1)"
        >
          <a class="page-link" href="javascript:void(0)">‹</a>
        </li>
        <li class="page-item active">
          <span class="page-link">{{ currentPage }}</span>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
          @click="goToPage(currentPage + 1)"
        >
          <a class="page-link" href="javascript:void(0)">›</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
          @click="goToPage(totalPages)"
        >
          <a class="page-link" href="javascript:void(0)">»</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    totalCount: { type: Number, required: true },
    itemsPerPage: { type: Number, required: true },
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
  },
  emits: ['page-change'],
  methods: {
    goToPage(page) {
      if (page < 1) page = 1
      if (page > this.totalPages) page = this.totalPages
      this.$emit('page-change', page)
    },
  },
  computed: {
    startRecord() {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    },
    endRecord() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalCount)
    },
  },
}
</script>
