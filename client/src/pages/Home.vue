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
            <th scope="col">Параметры</th>
            <th scope="col">Ссылка</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in group" :key="route.path">
            <td>{{ route.name || 'Без имени' }}</td>
            <td>{{ route.path }}</td>
            <td>
              <div v-if="hasParams(route.path)" class="d-flex gap-2">
                <div
                  v-for="param in extractParams(route.path)"
                  :key="param"
                  class="input-group input-group-sm"
                >
                  <span class="input-group-text">{{ param }}</span>
                  <input
                    v-model="params[route.path][param]"
                    type="text"
                    class="form-control"
                  />
                </div>
              </div>
              <span v-else></span>
            </td>
            <td>
              <router-link
                :to="generatePath(route.path)"
                class="btn btn-primary btn-sm"
                :disabled="!canNavigate(route.path)"
              >
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
import { reactive } from 'vue'
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

// Проверка, содержит ли маршрут параметры
const hasParams = (path) => /:\w+/.test(path)

// Извлечение параметров из пути маршрута
const extractParams = (path) => {
  const matches = path.match(/:\w+/g)
  return matches ? matches.map((param) => param.slice(1)) : []
}

// Реактивный объект для хранения параметров
const params = reactive(
  Object.fromEntries(
    router.options.routes.map((route) => [
      route.path,
      Object.fromEntries(extractParams(route.path).map((param) => [param, ''])),
    ])
  )
)

// Генерация пути с подстановкой значений параметров
const generatePath = (path) => {
  let newPath = path
  if (hasParams(path)) {
    for (const param of extractParams(path)) {
      newPath = newPath.replace(`:${param}`, params[path][param] || '')
    }
  }
  return newPath
}

// Проверка, заполнены ли все параметры
const canNavigate = (path) => {
  if (!hasParams(path)) return true
  return extractParams(path).every((param) => params[path][param])
}
</script>

<style>
.container {
  max-width: 800px;
}
.input-group {
  flex-grow: 1;
}
</style>
