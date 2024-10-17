<template>
  <header class="navbar">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link to="/public" class="navbar-logo">
        Модуль «Расчет Заказа {{ roleStore.roleDisplayName }}»
      </router-link>
      <!-- Селектор роли -->
      <div class="selector-group">
        <label for="role-selector" class="me-4">Выбор роли:</label>
        <select
          class="form-select"
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

<style scoped>
.navbar {
  height: 70px;
  background: #eee;
  border-bottom: 3px solid #07e;
}

.navbar-logo {
  font-size: 32px;
  color: #07e;
  text-decoration: none;
}

/* Стили для группы селектора */
.selector-group {
  display: flex;
  align-items: center;
}

.selector-group label {
  margin-right: 8px;
}

.selector-group select {
  padding: 4px 8px;
  font-size: 16px;
}
</style>
