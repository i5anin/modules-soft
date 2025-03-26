<template>
  <nav aria-label="breadcrumb" class="ms-3">
    <ol class="breadcrumb bg-transparent p-0 m-0">
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
    const crumbs = []

    for (const record of route.matched) {
      let title = record.meta?.title
      if (!title) continue

      // Заменяем параметры в заголовке, если они есть
      if (route.params) {
        for (const [key, value] of Object.entries(route.params)) {
          title = title.replace(`:${key}`, value)
        }
      }

      let path = record.path
      for (const [key, value] of Object.entries(route.params)) {
        path = path.replace(`:${key}`, value)
      }

      crumbs.push({ title, path })
    }

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
