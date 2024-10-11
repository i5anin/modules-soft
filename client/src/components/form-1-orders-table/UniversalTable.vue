<template>
  <div>
    <pre>{{ data }}</pre>
    <pre>{{ console.log(data) }}</pre>
    <table class="table table-striped table-bordered">
      <thead>
      <tr>
        <th v-for="field in fields"
            :key="field.name">
          {{ field.title }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td v-for="field in fields"
            :key="field.name">
          {{ item[field.name] }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'UniversalTable',
  props: {
    fields: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
/* Дополнительные стили, если необходимо */
</style>