<template>
  <div class="col-md-6">
    <h5>Предложенный инструмент:</h5>
    <table class="table table-sm table-bordered table-hover table-striped">
      <thead>
        <tr class="text-center">
          <th>Т шт.</th>
          <th>Комментарии оператора</th>
          <th>Расположение в дереве инструмента</th>
          <th>Характеристики</th>
          <th>Добавить</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in instruments" :key="generateUniqueId(item)">
          <td class="text-center align-middle">{{ item.t_op }}</td>
          <td>
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item small p-1"
                v-for="(comment, idx) in initialComments(item)"
                :key="idx"
              >
                {{ comment }}
              </li>
              <li
                v-if="isExpanded(item)"
                class="list-group-item small p-1"
                v-for="(comment, idx) in additionalComments(item)"
                :key="idx"
              >
                {{ comment }}
              </li>
            </ul>
            <div
              v-if="item.comments_operators.length > 10"
              class="mt-2 text-center"
            >
              <button
                class="btn btn-sm btn-outline-secondary"
                type="button"
                @click="toggleCollapse(item)"
              >
                {{ isExpanded(item) ? 'Скрыть' : 'Показать остальные' }}
              </button>
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

const isExpanded = (item) => {
  const id = generateUniqueId(item)
  return props.collapseStates[id]
}

const initialComments = (item) => {
  return item.comments_operators.slice(0, 10)
}

const additionalComments = (item) => {
  return item.comments_operators.slice(10)
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

.small {
  font-size: 0.875rem; /* Соответствует Bootstrap классу .small */
}

.p-1 {
  padding: 0.25rem; /* Соответствует Bootstrap классу .p-1 */
}

@media (max-width: 767px) {
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
