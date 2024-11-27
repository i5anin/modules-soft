<template>
  <div class="container mt-4">
    <h4>Список маршрутов</h4>
    <div
      v-for="(group, groupName) in groupedRoutes"
      :key="groupName"
      class="mb-4"
    >
      <h6 class="mt-3 text-capitalize">{{ groupName }}</h6>
      <table class="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th scope="col">Название маршрута</th>
            <th scope="col">Путь</th>
            <th scope="col">Ссылка</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in group" :key="route.path">
            <td>{{ route.name || 'Без имени' }}</td>
            <td>{{ route.path }}</td>
            <td>
              <router-link :to="route.path" class="btn btn-primary btn-sm">
                Перейти
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Определение группы маршрутов по базовому префиксу
const getBasePrefix = (path) => {
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) return 'root'
  const base = segments[0].replace(/s$/, '') // Убираем "s" в конце, если есть
  return base
}

const router = useRouter()

// Группировка маршрутов
const groupedRoutes = router.options.routes.reduce((acc, route) => {
  const prefix = getBasePrefix(route.path)
  if (!acc[prefix]) acc[prefix] = []
  acc[prefix].push(route)
  return acc
}, {})
</script>

<style>
.container {
  max-width: 800px;
}
</style>
