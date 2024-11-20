<template>
  <div>
    <h1>Родительский компонент</h1>
    <p>Сообщение от дочернего: {{ childMessage }}</p>
    <ChildComponent
      :message="parentMessage"
      @updateMessage="handleChildMessage"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

export default {
  components: { ChildComponent },
  setup() {
    const parentMessage = ref('Привет от родителя')
    const childMessage = ref('')

    const handleChildMessage = (newMessage) => {
      childMessage.value = newMessage
    }

    return { parentMessage, childMessage, handleChildMessage }
  },
}
</script>
