<template>
  <div
    data-bs-theme="dark"
    class="bg-dark text-light"
  >
    <Header />
    <Menu />
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script setup>
  import Header from '@/modules/_main/components/AppHeader.vue'
  import Menu from '@/modules/_main/components/AppMenu.vue'
</script>
