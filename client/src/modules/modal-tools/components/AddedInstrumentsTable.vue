<template>
  <div class="col-md-6">
    <div v-if="instruments.length > 0">
      <h5>Добавленные инструменты:</h5>
      <table class="table table-sm table-bordered table-hover table-striped">
        <thead>
          <tr class="text-center">
            <th style="width: 2%">Т шт.</th>
            <th style="width: 36%">Комментарии оператора</th>
            <th style="width: 20%">Расположение в дереве инструмента</th>
            <th style="width: 20%">Характеристики</th>
            <th style="width: 10%">Удалить</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in instruments"
            :key="generateUniqueId(item)"
          >
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
                v-if="item.comments_operators.length > 3"
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
  return item.comments_operators.slice(0, 3)
}

const additionalComments = (item) => {
  return item.comments_operators.slice(3)
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
