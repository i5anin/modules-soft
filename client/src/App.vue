<template>
  <Navbar />

  <div class="py-3">
    <!-- container -->
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
