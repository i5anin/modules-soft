<template>
  <header class="navbar">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link to="/public" class="navbar-brand">
        Модуль «Расчет Заказа {{ roleStore.roleDisplayName }}»
      </router-link>
      <!-- Селектор роли -->
      <div class="selector-group d-flex align-items-center">
        <label for="role-selector" class="me-4">Выбор роли:</label>
        <select
          class="form-select"
          id="role-selector"
          v-model="roleStore.selectedRole"
          @change="onRoleChange"
          style="width: auto"
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

<style>
.navbar {
  height: 70px;
  background: #eee;
}

/* Стили для группы селектора */
.selector-group label {
  margin-right: 8px;
}

.selector-group select {
  padding: 4px 8px;
  font-size: 16px;
  width: auto; /* Чтобы селектор не занимал всю ширину */
}
</style>
