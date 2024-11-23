<template>
  <div
    v-if="visible"
    class="modal fade show"
    tabindex="-1"
    role="dialog"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
        </div>
        <div class="modal-body">
          <slot name="body">Default body content</slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn btn-primary" @click="saveChanges">
              Save changes
            </button>
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Close
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Modal Title',
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close', 'save'],
  methods: {
    closeModal() {
      this.$emit('close')
    },
    saveChanges() {
      this.$emit('save')
    },
  },
}
</script>

<style>
.modal.fade.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  margin: 10% auto;
}
</style>
