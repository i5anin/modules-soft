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
        <div
          class="modal-header d-flex justify-content-between align-items-center"
        >
          <h5 class="modal-title">{{ zagotovka.title || 'Заготовка' }}</h5>
          <button
            type="button"
            class="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style="width: 2.5rem; height: 2.5rem"
            aria-label="Close"
            @click="closeModal"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Название</th>
                <th>Значение</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, key) in zagotovka.fields || []" :key="key">
                <td class="fw-bold">{{ field.title }}</td>
                <td>
                  <span v-if="typeof zagotovka.data[key] !== 'object'">
                    {{ zagotovka.data[key] }}
                  </span>
                  <span v-else>
                    <div
                      v-for="(val, subKey) in zagotovka.data[key]"
                      :key="subKey"
                      class="mb-1"
                    >
                      {{ subKey }}: {{ val }}
                    </div>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'

export default {
  name: 'ZagotovkaModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    zagData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      default: 'tech',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const zagotovka = reactive({
      title: '',
      fields: [],
      data: {},
    })

    watch(
      () => props.zagData,
      (newData) => {
        zagotovka.title = newData.title || `Заготовка (${props.type})`
        zagotovka.fields = newData.fields || []
        zagotovka.data = newData.data || {}
      },
      { immediate: true }
    )

    const closeModal = () => {
      emit('close')
    }

    return {
      zagotovka,
      closeModal,
    }
  },
}
</script>

<style scoped>
.modal.fade.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  margin: 10% auto;
}
</style>
