<template>
  <div class="container mt-4">
    <!-- Таблица -->
    <TableComponent
      :fields="fields"
      :data="tableData"
      @row-clicked="openModal"
    />

    <!-- Модальное Окно -->
    <ModalComponent
      v-if="showModal"
      :show="showModal"
      :title="'Детали записи'"
      :data="selectedRow"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TableComponent from './TableComponent.vue'
import ModalComponent from './ModalComponent.vue'

// Определение полей таблицы
const fields = [
  { name: 'name', title: 'Название' },
  { name: 'description', title: 'Описание' },
  { name: 'quantity', title: 'Количество' },
  // Добавьте остальные поля по необходимости
]

// Данные таблицы
const tableData = [
  { name: 'Труба на барабан', description: 'ЛКК.04.02.00.701', quantity: 40 },
  { name: 'Кран', description: 'ЛКК.04.02.00.702', quantity: 15 },
  // Добавьте остальные записи по необходимости
]

// Состояния для модального окна
const showModal = ref(false)
const selectedRow = ref(null)

// Функция открытия модального окна
const openModal = (row) => {
  selectedRow.value = row
  showModal.value = true
}

// Функция закрытия модального окна
const closeModal = () => {
  showModal.value = false
  selectedRow.value = null
}
</script>

<style scoped>
/* Дополнительные стили при необходимости */
</style>
