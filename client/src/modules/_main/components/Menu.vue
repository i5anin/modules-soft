<template>
  <div>
    <!-- Кнопка открытия меню -->
    <button
      class="btn btn-dark position-fixed top-0 start-0 m-3"
      data-bs-toggle="offcanvas"
      data-bs-target="#sidebarMenu"
      aria-controls="sidebarMenu"
    >
      ☰ Меню
    </button>

    <!-- Боковое меню (offcanvas) -->
    <div
      class="offcanvas offcanvas-start bg-dark text-light"
      tabindex="-1"
      id="sidebarMenu"
      aria-labelledby="sidebarMenuLabel"
      data-bs-theme="dark"
    >
      <div class="offcanvas-header border-bottom">
        <h5 class="offcanvas-title" id="sidebarMenuLabel">Меню</h5>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Закрыть"
        ></button>
      </div>

      <div class="offcanvas-body">
        <div v-if="loading" class="text-center text-secondary">Загрузка...</div>
        <div v-else-if="errorMessage" class="alert alert-danger text-center">
          {{ errorMessage }}
        </div>

        <nav v-if="menu.length">
          <div class="list-group">
            <router-link
              v-for="item in menu"
              :key="item.name"
              :to="item.url"
              class="list-group-item list-group-item-action bg-dark text-light border-0"
              active-class="active bg-primary text-white"
            >
              {{ item.label }}
            </router-link>
          </div>
        </nav>
        <div v-else class="text-center text-muted">Меню пустое</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMenu } from '@/modules/api/authApi.js'

const menu = ref([]) // ✅ Меню всегда массив
const loading = ref(true)
const errorMessage = ref('')

// Запрос меню
const fetchMenu = async () => {
  try {
    const response = await getMenu()
    console.log('Полученное меню:', response)

    // Проверяем, является ли response массивом
    if (Array.isArray(response)) {
      menu.value = response
    } else if (response && typeof response === 'object' && response.data) {
      menu.value = response.data // Если API вернул объект с `data`
    } else {
      console.error('Неожиданный формат меню:', response)
      menu.value = []
    }
  } catch (error) {
    errorMessage.value = 'Ошибка загрузки меню'
  } finally {
    loading.value = false
  }
}

onMounted(fetchMenu)
</script>

<style scoped>
/* Стиль активного пункта */
.router-link-active {
  background-color: var(--bs-primary) !important;
  color: white !important;
}
</style>
