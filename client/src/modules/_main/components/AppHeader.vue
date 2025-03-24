<template>
  <header class="navbar navbar-expand-lg custom-gradient">
    <div
      :class="[
        'container-fluid',
        'd-flex',
        'justify-content-between',
        'align-items-center',
        'py-1',
      ]"
    >
      <!-- Левая часть: Кнопка "Меню" (отображается только если пользователь авторизован) -->
      <div
        v-if="authStore.isAuthenticated"
        class="d-flex align-items-center"
      >
        <button
          class="btn btn-dark"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
        >
          ☰ Меню
        </button>
      </div>
      <!-- Центр: Хлебные крошки -->
      <div class="d-flex flex-grow-1 justify-content-center">
        <Breadcrumbs />
      </div>
      <!-- Правая часть: Кнопка "Назад" и Данные пользователя -->
      <div class="d-flex align-items-center">
        <router-link
          v-if="authStore.isAuthenticated"
          class="btn btn-outline-light me-3"
          to="/"
        >
          Назад
        </router-link>
        <div
          v-if="authStore.isAuthenticated"
          class="d-flex align-items-center"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm text-light"
          ></span>
          <span v-else-if="user">{{ user.name }} {{ user.last_name }}</span>
          <button
            class="btn btn-sm btn-outline-light ms-3"
            @click="logout"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/entities/auth/authStore'
  import Breadcrumbs from '@/modules/_main/components/AppBreadcrumbs.vue'

  const authStore = useAuthStore()
  const router = useRouter()
  const user = ref(null)
  const loading = ref(true)

  // Загружаем данные пользователя
  const fetchUser = async () => {
    if (!authStore.isAuthenticated) {
      loading.value = false
      return
    }

    try {
      user.value = await authStore.getUser()
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error)
    } finally {
      loading.value = false
    }
  }

  // Выход из системы
  const logout = () => {
    authStore.logout()
    router.push('/login')
  }

  onMounted(fetchUser)
</script>

<style scoped>
  .navbar {
    min-height: 56px;
    display: flex;
    align-items: center;
  }

  .custom-gradient {
    background: linear-gradient(
      135deg,
      #37474f,
      #263238
    ); /* Глубокий синий + серый */
  }
</style>
