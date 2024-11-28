<template>
  <div
    v-if="visible && zagotovka.fields.length"
    class="modal fade show"
    tabindex="-1"
    role="dialog"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ zagotovka.title }}</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Название</th>
                <th>Значение</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="field in zagotovka.fields" :key="field.key">
                <td>{{ field.title }}</td>
                <td>
                  <span v-if="!isObject(zagotovka.data[field.key])">
                    {{ zagotovka.data[field.key] || '—' }}
                  </span>
                  <template v-else>
                    <div
                      v-for="(value, subKey) in zagotovka.data[field.key]"
                      :key="subKey"
                    >
                      {{ subKey }}: {{ value }}
                    </div>
                  </template>
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
import { reactive, watch, computed } from 'vue'

export default {
  name: 'ModalZagotovka',
  props: {
    visible: { type: Boolean, required: true },
    zagData: { type: Object, required: true },
    type: { type: String, required: true },
    nomId: { type: [String, Number], required: true },
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
        zagotovka.title = newData?.title || `Заготовка (${props.type})`
        zagotovka.fields = newData?.fields || []
        zagotovka.data = { ...newData?.data, nomId: props.nomId } || {}
      },
      { immediate: true }
    )

    const isObject = (value) =>
      value && typeof value === 'object' && !Array.isArray(value)

    const closeModal = () => emit('close')

    return {
      zagotovka,
      isObject,
      closeModal,
    }
  },
}
</script>
