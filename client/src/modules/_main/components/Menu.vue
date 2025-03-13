<template>
  <div>
    <!-- Кнопка открытия меню -->
    <button
      class="btn btn-dark position-fixed top-0 start-0 m-3"
      data-bs-toggle="offcanvas"
      data-bs-target="#sidebarMenu"
      aria-controls="sidebarMenu"
    >
      ☰ Меню
    </button>

    <!-- Боковое меню (offcanvas) -->
    <div
      class="offcanvas offcanvas-start text-bg-dark"
      tabindex="-1"
      id="sidebarMenu"
      aria-labelledby="sidebarMenuLabel"
      data-bs-theme="dark"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="sidebarMenuLabel">Меню</h5>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Закрыть"
        ></button>
      </div>

      <div class="offcanvas-body">
        <div v-if="loading" class="text-center">Загрузка меню...</div>
        <div v-else-if="errorMessage" class="text-danger text-center">
          {{ errorMessage }}
        </div>
        <nav v-else>
          <ul class="list-unstyled">
            <li v-for="item in menu" :key="item.id">
              <router-link class="nav-link text-white" :to="item.link">
                {{ item.label }}
              </router-link>

              <!-- Вложенные элементы (если есть) -->
              <ul v-if="item.children" class="ps-3">
                <li v-for="child in item.children" :key="child.id">
                  <router-link class="nav-link text-secondary" :to="child.link">
                    {{ child.label }}
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMenu } from '@/modules/api/authApi.js'

const menu = ref([])
const loading = ref(true)
const errorMessage = ref('')

// Запрос меню
const fetchMenu = async () => {
  try {
    menu.value = await getMenu()
  } catch (error) {
    errorMessage.value = 'Ошибка загрузки меню'
  } finally {
    loading.value = false
  }
}

onMounted(fetchMenu)
</script>
