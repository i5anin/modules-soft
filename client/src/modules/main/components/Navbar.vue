<template>
  <header class="navbar">
    <div class="container d-flex justify-content-between align-items-center">
      <router-link to="/public" class="navbar-logo">
        Модуль «Расчет Заказа {{ roleDisplayName }}»
      </router-link>
      <!-- Добавляем обычный select -->
      <div class="selector-group">
        <label for="role-selector" class="me-4">Выбор роли:</label>
        <select
          class="form-select"
          id="role-selector"
          v-model="selectedRole"
          @change="onRoleChange"
        >
          <option value="metrolog">Метролог</option>
          <option value="omts">ОМТС</option>
          <option value="tech_calc">Технолог</option>
        </select>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      selectedRole: 'metrolog', // Роль по умолчанию
      roleNames: {
        metrolog: 'Метролог',
        omts: 'ОМТС',
        tech_calc: 'Технолог',
      },
    }
  },
  computed: {
    roleDisplayName() {
      // Возвращаем отображаемое имя для текущей выбранной роли
      return this.roleNames[this.selectedRole]
    },
  },
  methods: {
    onRoleChange() {
      // Обработка изменения роли
      console.log('Выбранная роль:', this.selectedRole)
      // Здесь вы можете добавить логику для изменения отображения в зависимости от выбранной роли
    },
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
