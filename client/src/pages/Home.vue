<template>
  <!--  <h1>Расчет Заказа Метролог</h1>-->

  <!--  <router-link to="/add" class="btn btn-primary">Add</router-link>-->

  <!--  <hr>-->

  <Table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Edit / Remove</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>title1</td>
        <td>some text1</td>
        <td width="150px" class="text-center">
          <router-link to="/edit/123"
            ><i class="bi bi-pencil-square action-btn"></i
          ></router-link>
          <i class="bi bi-trash3 text-danger action-btn ms-2"></i>
        </td>
      </tr>
    </tbody>
  </Table>
</template>

<script setup>
import Table from '@/modules/form-1/components/Index.vue'

// import useHome from '../store/home.module.js'
// const _home = useHome()
</script>
