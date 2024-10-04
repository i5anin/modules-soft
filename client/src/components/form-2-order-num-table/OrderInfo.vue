<template>
  <div>
    <div v-if="header" class="card mb-3">
      <div class="card-header">
        Информация о заказе
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <p v-for="field in leftFields" :key="field.name" class="card-text">
              <strong>{{ field.title }}:</strong>
              {{ formatValue(field.name, header.data[field.name]) }}
            </p>
          </div>
          <div class="col-md-6">
            <p v-for="field in rightFields" :key="field.name" class="card-text">
              <strong>{{ field.title }}:</strong>
              {{ formatValue(field.name, header.data[field.name]) }}
            </p>
          </div>
        </div>
        <div v-if="hasNonEmptyComments" class="card mt-3">
          <div class="card-body">
            <template v-for="commentField in commentFields" :key="commentField.name">
              <p v-if="header.data[commentField.name]" class="card-text">
                <span>
                  <strong>{{ commentField.title }}:</strong>
                  {{ header.data[commentField.name] }}
                </span>
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import formatters from "@/components/shared/formatters.js";

export default {
  props: {
    header: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasNonEmptyComments() {
      return this.commentFields.some(field => this.header.data[field.name] && this.header.data[field.name].trim() !== '');
    },
    commentFields() {
      return this.header.fields ? this.header.fields.filter(field => field.name.includes('comments')) : [];
    },
    nonCommentFields() {
      return this.header.fields ? this.header.fields.filter(field => !field.name.includes('comments')) : [];
    },
    leftFields() {
      return this.nonCommentFields.slice(0, Math.ceil(this.nonCommentFields.length / 2));
    },
    rightFields() {
      return this.nonCommentFields.slice(Math.ceil(this.nonCommentFields.length / 2));
    },
  },
  methods: {
    formatValue(fieldName, value) {
      if (fieldName.toLowerCase().includes('price')) {
        return formatters.formatPrice(value);
      }
      if (fieldName.toLowerCase().includes('date')) {
        return formatters.formatDate(value);
      }
      if (fieldName.toLowerCase().includes('time')) {
        return formatters.formatTime(value);
      }
      return value;
    },
  },
};
</script>

<style scoped>
/* Ваши стили */
</style>