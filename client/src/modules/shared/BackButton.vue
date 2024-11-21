<template>
  <div>
    <router-link
      v-if="targetRoute"
      :to="{ name: targetRoute }"
      :class="[
        'btn',
        'btn-secondary',
        'me-3',
        'mb-2',
        'btn-sm',
        'btn-outline-light',
      ]"
    >
      <SvgIcon type="mdi" :path="mdiArrowLeft" class="me-1" />
      Назад
    </router-link>
    <button
      v-else
      @click="goBack"
      :class="[
        'btn',
        'btn-secondary',
        'me-3',
        'mb-2',
        'btn-sm',
        'btn-outline-light',
      ]"
    >
      <SvgIcon type="mdi" :path="mdiArrowLeft" class="me-1" />
      Назад
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeft } from '@mdi/js'

const router = useRouter()

// Пропс для передачи целевого маршрута
const props = defineProps({
  targetRoute: {
    type: String,
    default: null,
  },
})

// Функция для перехода "Назад" в истории маршрутов
const goBack = () => {
  router.back()
}
</script>
