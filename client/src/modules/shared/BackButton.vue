<template>
  <button
    v-if="!targetRoute"
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
  <router-link v-else :to="{ name: targetRoute }">
    <button
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
  </router-link>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiArrowLeft } from '@mdi/js'

const router = useRouter()

// Пропс с именем целевого маршрута; по умолчанию null
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
