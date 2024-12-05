<template>
  <div class="row">
    <div class="col-12">
      <!-- Сообщение при отсутствии данных -->
      <div v-if="tableData.length === 0" class="alert alert-warning">
        Нет данных.
      </div>
      <div v-else>
        <table
          class="table-sbor table table-bordered table-striped table-sm table-hover"
        >
          <thead>
            <tr style="font-size: 12px">
              <th
                scope="col"
                style="width: 30px"
                title="развернуть сборку"
              ></th>
              <th scope="col" style="width: 30px" title="статусы"></th>
              <th
                scope="col"
                v-for="field in filteredFields"
                :key="field.name"
                :style="{ width: field.width || 'auto' }"
              >
                {{ field.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <SborNode
              v-for="sbor in tableData"
              :key="sbor.id"
              :sbor="sbor"
              :depth="0"
              :detail="detail"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { store } from './store.js'
import SborNode from './ServerSborNode.vue'

export default {
  name: 'SborMain',
  components: { SborNode },
  props: {
    tableData: Array, // Пропс для исходных данных
    tableFields: Array, // Пропс для исходных полей
    detail: {
      type: Object,
      default: () => ({ route: '', idKey: '' }), // Объект с двумя свойствами
    },
  },
  setup(props) {
    const sborStore = store()

    // Следим за изменениями в prop tableData и обновляем store
    watch(
      () => props.tableData,
      (newData) => {
        sborStore.setTableData(newData)
      },
      { immediate: true }
    )

    // Следим за изменениями в prop tableFields и обновляем store
    watch(
      () => props.tableFields,
      (newFields) => sborStore.setTableFields(newFields),
      { immediate: true }
    )

    // filteredFields из store без дублирования переменных
    const filteredFields = computed(() => sborStore.filteredFields)

    return { filteredFields }
  },
}
</script>
