<template>
  <header class="navbar navbar-expand-lg navbar-light bg-light">
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <router-link to="/public" class="navbar-brand mb-0 h1">
        Модуль «Расчет Заказа {{ roleStore.roleDisplayName }}»
      </router-link>
      <!-- Селектор роли -->
      <div class="d-flex align-items-center">
        <label for="role-selector" class="me-2 mb-0">Выбор роли:</label>
        <select
          class="form-select form-select-sm w-auto"
          id="role-selector"
          v-model="roleStore.selectedRole"
          @change="onRoleChange"
        >
          <option
            v-for="(name, key) in roleStore.roleNames"
            :key="key"
            :value="key"
          >
            {{ name }}
          </option>
        </select>
      </div>
    </div>
  </header>
</template>

<script>
import { useRoleStore } from '../store' // Убедитесь, что путь корректный

export default {
  setup() {
    const roleStore = useRoleStore()

    const onRoleChange = () => {
      console.log('Выбранная роль:', roleStore.selectedRole)
      // Дополнительная логика при изменении роли (если требуется)
    }

    return {
      roleStore,
      onRoleChange,
    }
  },
}
</script>
