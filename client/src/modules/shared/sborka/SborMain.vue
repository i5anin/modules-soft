<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <!-- Сообщение при отсутствии данных -->
        <div v-if="tableData.length === 0" class="alert alert-warning">
          Нет данных для отображения.
        </div>
        <div v-else>
          <table
            class="table-sbor table table-bordered table-striped table-sm table-hover"
          >
            <thead>
              <tr style="font-size: 12px">
                <th scope="col" style="width: 30px" title="развернут статус">
                  Сборка
                </th>
                <th scope="col" style="width: 30px" title="статусы">Статусы</th>
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
              />
              <!-- :key="sbor.sbor_orders__id" - было -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { store } from './store.js'
import SborNode from './SborNode.vue'

export default {
  name: 'SborMain',
  components: { SborNode },
  props: {
    tableData: {
      type: Array,
      default: () => [],
    },
    tableFields: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const sborStore = store()

    // Следим за props и сразу обновляем store
    watch(
      () => props.tableData,
      (newData) => {
        sborStore.setTableData(newData)
      },
      { immediate: true }
    )

    watch(
      () => props.tableFields,
      (newFields) => sborStore.setTableFields(newFields),
      { immediate: true }
    )

    return {
      tableData: computed(() => sborStore.tableData),
      filteredFields: computed(() => sborStore.filteredFields),
      hasIsSborField: computed(() => sborStore.hasIsSborField),
      hasStatusField: computed(() => sborStore.hasStatusField),
    }
  },
}
</script>

<style>
.table-sbor > tbody > tr:hover > td {
  background-color: #f3f8ff !important; /* Светло-голубой цвет при наведении */
}
</style>
