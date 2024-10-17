// src/stores/roleStore.js
import { defineStore } from 'pinia'

export const useRoleStore = defineStore('roleStore', {
  state: () => ({
    selectedRole: 'metrolog', // Роль по умолчанию
    roleNames: {
      metrolog: 'Метролог',
      omts: 'ОМТС',
      tech_calc: 'Технолог',
    },
  }),
  actions: {
    setSelectedRole(role) {
      this.selectedRole = role
    },
  },
  getters: {
    roleDisplayName(state) {
      return state.roleNames[state.selectedRole]
    },
  },
})
