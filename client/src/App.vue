<template>
  <Navbar />

  <div class="py-3">
    <!-- container -->
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './modules/Navbar.vue'
</script>
