<template>
  <nav aria-label="breadcrumb" class="ms-3">
    <ol class="breadcrumb bg-transparent p-0 m-0">
      <li class="breadcrumb-item">
        <router-link to="/" class="text-white"> Главная </router-link>
      </li>
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.path"
        class="breadcrumb-item"
        :class="{ 'text-muted': index === breadcrumbs.length - 1 }"
      >
        <template v-if="index === breadcrumbs.length - 1">
          {{ crumb.title }}
        </template>
        <router-link v-else :to="crumb.path" class="text-white">
          {{ crumb.title }}
        </router-link>
      </li>
    </ol>
  </nav>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const breadcrumbs = computed(() => {
    const segments = route.path.split('/').filter(Boolean)
    const crumbs = []
    let path = ''

    for (const segment of segments) {
      path += `/${segment}`

      const matchedRoute = route.matched.find((r) => r.path === path)
      const title = matchedRoute?.meta?.title

      if (title) {
        crumbs.push({ title, path })
      }
    }

    // Вставляем "Главная" в начало
    crumbs.unshift({ title: 'Главная', path: '/' })

    return crumbs
  })
</script>

<style scoped>
  .breadcrumb-item a {
    text-decoration: none;
  }

  .breadcrumb-item.text-muted {
    font-weight: bold;
  }
</style>
