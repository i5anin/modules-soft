<template>
  <div data-bs-theme="dark" class="bg-dark text-light">
    <BaseToast />
    <Header />
    <Menu />
    <div class="container-fluid">
      <router-view :key="$route.name" />
    </div>
  </div>
</template>

<script setup>
  import Header from '@/widgets/layout/AppHeader.vue'
  import Menu from '@/widgets/layout/AppMenu.vue'
  import BaseToast from '@/widgets/error/BaseToast.vue'
</script>
