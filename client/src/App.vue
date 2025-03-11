<template>
  <div data-bs-theme="dark" class="bg-dark text-light">
    <Navbar />
    <div class="container-fluid">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/modules/_main/components/Navbar.vue'
</script>
