<template>
  <div>
    <h2>Дочерний компонент</h2>
    <p>Полученное сообщение: {{ message }}</p>
    <input
      v-model="childInput"
      placeholder="Введите новое сообщение"
      @input="emitMessage"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  emits: ['updateMessage'],
  setup(props, { emit }) {
    const childInput = ref('')

    const emitMessage = () => {
      emit('updateMessage', childInput.value)
    }

    watch(
      () => props.message,
      (newVal) => {
        childInput.value = newVal // Синхронизируем ввод с пропсами, если нужно
      }
    )

    return { childInput, emitMessage }
  },
}
</script>
