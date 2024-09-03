<template>
  <h1>Add page</h1>

  <router-link to="/" class="btn btn-primary">Go back</router-link>

  <hr>

  <div class="row">
    <div class="col-md-4">
      <form @submit.prevent="_home.add">
        <div class="py-2">
          <label class="form-label">Title:</label>
          <input type="text" class="form-control" v-model="_home.Form.title">
        </div>
        <div class="py-2">
          <label class="form-label">Description:</label>
          <textarea class="form-control" v-model="_home.Form.description"></textarea>
        </div>
        <div class="py-2">
          <button class="btn btn-success">Add</button>
        </div>
      </form>
    </div>
  </div>

</template>


<script setup>
// import { useHomeStore } from '../store/home.module.js'
// const _home = useHome()



</script>
