<template>
  <div>
    <div v-if="header" class="card mb-3">
      <div class="card-header">
        Информация о заказе
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <p v-for="field in header.fields" :key="field.name" class="card-text">
              <strong>{{ field.title }}:</strong> {{ header.data[field.name] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formatters from "@/components/shared/formatted.js";

export default {
  props: {
    header: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedDate() {
      return formatters.formatDate(this.header.data?.date);
    },
  },
  methods: {
  },
};
</script>

<style scoped>
/* Ваши стили */
</style>