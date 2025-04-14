// src/shared/stores/store.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const type = ref('info')
  const visible = ref(false)

  const isVisible = computed(() => visible.value)

  function show(newMessage, newType = 'info', timeout = 5000) {
    message.value = newMessage
    type.value = newType
    visible.value = true

    if (timeout > 0) {
      setTimeout(() => {
        visible.value = false
      }, timeout)
    }
  }

  function hide() {
    visible.value = false
  }

  return {
    message,
    type,
    isVisible,
    show,
    hide,
  }
})
