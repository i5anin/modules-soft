<template>
  <div class="col-md-6">
    <div v-if="instruments.length > 0">
      <h5>Добавленные инструменты:</h5>
      <table class="table table-sm table-bordered table-hover table-striped">
        <thead>
          <tr class="text-center">
            <th>#</th>
            <th>Т шт.</th>
            <th>Расположение в дереве инструмента</th>
            <th>Характеристики</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in instruments"
            :key="generateUniqueId(item)"
          >
            <td class="text-center align-middle">{{ index + 1 }}</td>
            <td class="text-center align-middle">{{ item.t_op }}</td>
            <td>
              <ul class="list-group list-group-flush">
                <li
                  class="list-group-item"
                  v-for="(segment, idx) in item.path.split(' > ')"
                  :key="idx"
                >
                  {{ segment }}
                </li>
              </ul>
            </td>
            <td>
              <ul class="list-group list-group-flush list-group-item-success">
                <li
                  class="list-group-item"
                  v-for="(value, key) in item.property_description"
                  :key="key"
                >
                  {{ key }}: <b>{{ value }}</b>
                </li>
              </ul>
            </td>
            <td class="text-center align-middle">
              <button
                type="button"
                class="btn btn-circle"
                @click="$emit('remove-instrument', item)"
              >
                <svg-icon type="mdi" :path="mdiDelete" color="red" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { mdiDelete } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps({
  instruments: {
    type: Array,
    required: true,
  },
})

const generateUniqueId = (item) => {
  return `${item.tool_group_id}-${JSON.stringify(item.property_description)}`
}
</script>

<style scoped>
.table th {
  text-align: center;
}
.btn-circle {
  background-color: transparent;
  border: none;
}
</style>
