<template>
  <div>
    <!--    data-bs-theme="dark"-->
    <!--    style="background-color: #aaaaaa; min-height: 100vh"-->

    <Navbar />

    <div class="py-3">
      <!-- container -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Navbar from './modules/main/components/Navbar.vue'
</script>
