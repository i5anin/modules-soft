<template>
  <div class="container-fluid">
    <!--    <h5 class="mt-4">Номенклатуры</h5>-->
    <div class="row">
      <div class="col-12">
        <div v-if="nomtable.length === 0" class="alert alert-warning">
          Нет данных для отображения.
        </div>
        <!-- Контейнер для горизонтальной прокрутки -->
        <div v-else>
          <table
            class="table table-bordered table-striped table-sm table-hover"
          >
            <thead>
              <tr style="font-size: 12px">
                <th
                  scope="col"
                  style="width: 40px"
                  title="развернут статус"
                ></th>
                <th scope="col" style="width: 40px" title="статусы"></th>
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
                v-for="sbor in nomtable"
                :key="sbor.sbor_orders__id"
                :sbor="sbor"
                :fields="filteredFields"
                :depth="0"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import SborNode from './SborNode.vue'

export default {
  name: 'SborMain',
  components: { SborNode },
  props: {
    nomtable: {
      type: Array,
      required: true,
    },
    tableFields: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const excludedFields = ['sbor_orders__id', 'is_sbor', 'ordersnom_id']

    const filteredFields = computed(() => {
      return props.tableFields.filter(
        (field) => !excludedFields.includes(field.name)
      )
    })

    return { filteredFields }
  },
}
</script>
