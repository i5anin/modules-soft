<template>
  <div>
    <!--    data-bs-theme="dark"-->
    <!--    style="background-color: #aaaaaa; min-height: 100vh"-->

    <Navbar />

    <div class="container-fluid bg-gradient bg">
      <!-- container -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/modules/_main/components/Navbar.vue'
</script>

<style>
body {
  background-color: #e6e6e6 !important;
}
</style>
