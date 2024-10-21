// src/stores/roleStore.js
import { defineStore } from 'pinia'

export const useRoleStore = defineStore('roleStore', {
  state: () => ({
    selectedRole: 'metrolog',
    roleNames: {
      metrolog: 'Метролог',
      omts: 'ОМТС',
      tech_calc: 'Технолог',
    },
    selectedTypes: 'ttt',
    types: {
      metrolog: 'ttt',
      omts: 'rrr',
      tech_calc: 'wew',
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
