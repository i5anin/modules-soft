// src/store/home.module.js
import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', {
  state: () => ({
    title: 'some title',
    Form: {
      title: '',
      description: '',
    },
    currentPage: 1,
    itemsPerPage: 15,
    searchQuery: '',
  }),
})
