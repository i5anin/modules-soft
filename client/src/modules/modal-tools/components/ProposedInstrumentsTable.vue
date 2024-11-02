<template>
  <div class="col-md-6">
    <h5>Предложенный инструмент:</h5>
    <table class="table table-sm table-bordered table-hover table-striped">
      <thead>
        <tr class="text-center">
          <th>#</th>
          <th>Т шт.</th>
          <th>Комментарии оператора</th>
          <th>Расположение в дереве инструмента</th>
          <th>Характеристики</th>
          <th>Добавить</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in instruments" :key="generateUniqueId(item)">
          <td class="text-center align-middle">{{ index + 1 }}</td>
          <td class="text-center align-middle">{{ item.t_op }}</td>
          <td>
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item"
                v-for="(comment, idx) in item.comments_operators.slice(0, 3)"
                :key="idx"
                style="font-size: 12px; padding: 2px"
              >
                {{ comment }}
              </li>
            </ul>
            <div
              v-if="item.comments_operators.length > 3"
              class="text-center mt-2"
            >
              <button
                class="btn btn-sm btn-outline-secondary"
                type="button"
                @click="toggleCollapse(item)"
              >
                {{
                  collapseStates[generateUniqueId(item)]
                    ? 'Скрыть'
                    : 'Показать остальные'
                }}
              </button>
              <div v-if="collapseStates[generateUniqueId(item)]" class="mt-2">
                <ul class="list-group list-group-flush">
                  <li
                    class="list-group-item"
                    v-for="(comment, idx) in item.comments_operators.slice(3)"
                    :key="idx"
                    style="font-size: 13px"
                  >
                    {{ comment }}
                  </li>
                </ul>
              </div>
            </div>
          </td>
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
            <ul class="list-group list-group-flush list-group-item-warning">
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
              @click="$emit('add-instrument', item)"
            >
              <svg-icon type="mdi" :path="mdiPlusCircle" color="green" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { mdiPlusCircle } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps({
  instruments: {
    type: Array,
    required: true,
  },
  collapseStates: {
    type: Object,
    required: true,
  },
})

const generateUniqueId = (item) => {
  return `${item.tool_group_id}-${JSON.stringify(item.property_description)}`
}

const toggleCollapse = (item) => {
  const id = generateUniqueId(item)
  props.collapseStates[id] = !props.collapseStates[id]
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
