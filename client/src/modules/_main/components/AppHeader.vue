<template>
  <header class="navbar navbar-expand-lg">
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <!-- Хлебные крошки с нормальным отступом -->

      <!-- BackButton отображается только если есть токен -->
      <router-link
        v-if="authStore.isAuthenticated"
        class="navbar-brand mb-0"
        to="/"
      ></router-link>

      <!-- Данные пользователя -->
      <div
        v-if="authStore.isAuthenticated"
        class="d-flex align-items-center"
      >
        <span v-if="loading" />
        <span v-else-if="user"> {{ user.name }} {{ user.last_name }} </span>

        <!-- Кнопка "Выход" -->
        <button
          class="btn btn-sm btn-outline-danger ms-3"
          @click="logout"
        >
          Выйти
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/entities/auth/authStore'

  const authStore = useAuthStore()
  const router = useRouter()
  const user = ref(null)
  const loading = ref(true)

  // Загружаем данные пользователя (только если есть токен)
  const fetchUser = async () => {
    if (!authStore.isAuthenticated) return

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
