<template>
  <div>
    <!-- Боковое меню (offcanvas) -->
    <div
      id="sidebarMenu"
      class="offcanvas offcanvas-start bg-dark text-light"
      tabindex="-1"
      aria-labelledby="sidebarMenuLabel"
      data-bs-theme="dark"
    >
      <div class="offcanvas-header border-bottom">
        <h5 id="sidebarMenuLabel" class="offcanvas-title"> Меню </h5>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Закрыть"
        ></button>
      </div>
      <div class="offcanvas-body">
        <div v-if="loading" class="text-center text-secondary">
          Загрузка...
        </div>
        <div v-else-if="errorMessage" class="alert alert-danger text-center">
          {{ errorMessage }}
        </div>
        <nav v-if="menu.length">
          <div class="list-group">
            <template v-for="item in menu" :key="item.name">
              <!-- Доступный маршрут -->
              <router-link
                v-if="isRouteAvailable(item.url)"
                :to="item.url"
                class="list-group-item list-group-item-action border-0"
                active-class="active bg-primary text-white"
              >
                {{ item.label }}
              </router-link>
              <!-- Недоступный маршрут -->
              <div
                v-else
                class="list-group-item text-secondary border-0 disabled"
                aria-disabled="true"
              >
                {{ item.label }}
              </div>
            </template>
          </div>
        </nav>
        <div v-else class="text-center text-muted"> Меню пустое </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { getMenu } from '@/modules/api/authApi.js'
  import { useAuthStore } from '@/entities/auth/authStore' // ✅ Подключаем authStore

  const authStore = useAuthStore()
  const menu = ref([])
  const loading = ref(true)
  const errorMessage = ref('')
  const router = useRouter()

  // Кешируем доступные маршруты
  const availableRoutes = computed(() => {
    return new Set(router.getRoutes().map((route) => route.path))
  })

  // Проверка наличия маршрута
  const isRouteAvailable = (path) => availableRoutes.value.has(path)

  // Запрос меню (только если пользователь авторизован)
  const fetchMenu = async () => {
    if (!authStore.isAuthenticated) {
      loading.value = false
      return
    }

    try {
      const response = await getMenu()
      const data = Array.isArray(response) ? response : (response?.data ?? [])
      menu.value = data.filter(
        (item) => item?.url && typeof item.url === 'string'
      )
    } catch (error) {
      console.error(error)
      errorMessage.value = 'Ошибка загрузки меню'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchMenu)
</script>
