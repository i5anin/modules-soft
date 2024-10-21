<template>
  <header class="navbar navbar-expand-lg navbar-light">
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

      <!-- Селектор типа -->
      <div class="d-flex align-items-center">
        <label for="type-selector" class="me-2 mb-0">Выбор типа:</label>
        <select
          class="form-select form-select-sm w-auto"
          id="type-selector"
          v-model="roleStore.selectedTypes"
          @change="onTypeChange"
        >
          <option
            v-for="(type, key) in roleStore.types"
            :key="key"
            :value="type"
          >
            {{ type }}
          </option>
        </select>
      </div>
    </div>
  </header>
</template>

<script>
import { useRoleStore } from '../store/index.js' // Убедитесь, что путь корректный

export default {
  setup() {
    const roleStore = useRoleStore()

    const onRoleChange = () => {
      console.log('Выбранная роль:', roleStore.selectedRole)
      // Дополнительная логика при изменении роли (если требуется)
    }

    const onTypeChange = () => {
      console.log('Выбранный тип:', roleStore.selectedTypes)
      // Дополнительная логика при изменении типа (если требуется)
    }

    return {
      roleStore,
      onRoleChange,
      onTypeChange,
    }
  },
}
</script>
