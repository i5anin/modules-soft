<template>
  <div
    class="container d-flex justify-content-center align-items-center vh-100"
  >
    <div class="card shadow-sm p-4" style="max-width: 400px; width: 100%">
      <div class="text-center mb-3">
        <img src="@/assets/logo-pf-forum.svg" alt="Логотип" class="logo" />
      </div>
      <h2 class="text-center mb-4">Вход в систему</h2>
      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="form-floating mb-3">
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="Email"
          />
          <label for="email">Email</label>
          <div v-if="errors.email" class="invalid-feedback">
            {{ errors.email }}
          </div>
        </div>
        <!-- Пароль -->
        <div class="form-floating mb-3">
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            placeholder="Пароль"
          />
          <label for="password">Пароль</label>
          <div v-if="errors.password" class="invalid-feedback">
            {{ errors.password }}
          </div>
        </div>
        <!-- Кнопка входа -->
        <button type="submit" class="btn btn-primary w-100"> Войти </button>
      </form>
      <!-- Ошибка авторизации -->
      <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/entities/auth/authStore'

  const router = useRouter()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')
  const errors = ref({ email: '', password: '' })

  const validateForm = () => {
    errors.value = { email: '', password: '' }
    let isValid = true

    if (!email.value.trim()) {
      errors.value.email = 'Введите email'
      isValid = false
    }

    if (!password.value.trim()) {
      errors.value.password = 'Введите пароль'
      isValid = false
    }

    return isValid
  }

  const handleLogin = async () => {
    errorMessage.value = ''
    if (!validateForm()) return

    try {
      await authStore.loginUser(email.value, password.value)
      await router.push('/')
    } catch (error) {
      errorMessage.value = error.message
    }
  }
</script>

<style scoped>
  .logo {
    max-width: 100px;
    height: auto;
  }
</style>
