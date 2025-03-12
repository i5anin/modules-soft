<template>
  <div
    v-if="loading"
    class="progress thin-progress"
    role="progressbar"
    aria-label="Индикатор загрузки"
  >
    <div
      class="progress-bar progress-bar-striped progress-bar-animated"
      :style="{ width: progressWidth }"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, watch } from 'vue'

const props = defineProps({
  loading: { type: Boolean, required: true },
})

const progress = ref(0)
let animationFrame = null

const progressWidth = computed(() => `${progress.value}%`)

// Функция для анимации
const animateProgress = startTime => {
  if (!props.loading) return // Прерываем, если загрузка завершена

  const elapsedTime = performance.now() - startTime
  progress.value = Math.min((elapsedTime / 1000) * 100, 100) // Заполняем за 1 сек

  if (progress.value < 100 && props.loading) {
    animationFrame = requestAnimationFrame(() => animateProgress(startTime))
  } else if (!props.loading) {
    progress.value = 0 // Сбрасываем прогресс, если загрузка завершена
  }
}

// Следим за `loading` и запускаем анимацию
watch(
  () => props.loading,
  newLoading => {
    if (newLoading) {
      progress.value = 0
      if (animationFrame) cancelAnimationFrame(animationFrame) // Очищаем предыдущую анимацию
      animationFrame = requestAnimationFrame(() =>
        animateProgress(performance.now())
      )
    } else {
      if (animationFrame) cancelAnimationFrame(animationFrame) // Останавливаем анимацию
      progress.value = 0 // Сбрасываем прогресс
    }
  },
  { immediate: true } // Для корректной инициализации
)
</script>

<style scoped>
.thin-progress {
  height: 1px;
}

.progress-bar {
  transition: width 0.1s linear;
}
</style>
