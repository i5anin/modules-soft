<template>
  <div class="mt-4">
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
            <th scope="col" style="width: 15%">Название маршрута</th>
            <th scope="col" style="width: 15%">Путь</th>
            <th scope="col" style="width: 15%">Параметры</th>
            <th scope="col" style="width: 10%">Тип</th>
            <th scope="col" style="width: 10%">ID перехода/Route</th>
            <th scope="col" style="width: 10%">Редактирование</th>
            <th scope="col" style="width: 10%">Доступы</th>
            <th scope="col" style="width: 5%">Ссылка</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="route in group" :key="route.path">
            <td>{{ route.name || '' }}</td>
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
            <td>{{ route.props && route.props.type }}</td>
            <td>
              <template v-if="route.props && route.props.link">
                {{ route.props.link }}
                <template v-if="route.props.route"
                  >({{ route.props.route }})</template
                >
              </template>
            </td>

            <td>{{ route.props && route.props.edit ? 'Да' : '' }}</td>
            <td>
              {{
                route.props && route.props.routeAccess
                  ? route.props.routeAccess.join(', ')
                  : ''
              }}
            </td>
            <td>
              <router-link
                v-if="canNavigate(route.path)"
                :to="generatePath(route.path)"
                class="btn btn-primary btn-sm"
              >
                Перейти
              </router-link>
              <button v-else class="btn btn-primary btn-sm" disabled>
                Перейти
              </button>
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
  return segments[0]
}

const router = useRouter()

// Группировка маршрутов с извлечением props
const groupedRoutes = router.options.routes.reduce((acc, route) => {
  const prefix = getBasePrefix(route.path)

  // Извлекаем props, если функция передана
  const props =
    typeof route.props === 'function' ? route.props({ params: {} }) : {}

  if (!acc[prefix]) acc[prefix] = []
  acc[prefix].push({
    ...route,
    props, // Добавляем обработанные props
  })

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
