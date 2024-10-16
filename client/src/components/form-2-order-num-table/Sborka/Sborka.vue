<template>
  <div class="container-fluid">
    <h1>Сборка</h1>
    <div class="row">
      <div class="col-12">
        <!-- Динамическое отображение всех полей таблицы -->
        <table class="table table-hover">
          <thead>
            <tr>
              <th v-for="field in tableFields" :key="field.name">
                {{ field.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <SborNode
              v-for="sbor in ordersSbors"
              :key="sbor.sbor_orders__id"
              :sbor="sbor"
              :fields="tableFields"
              :depth="0"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { fetchOrders } from '@/api/orders.js'
import SborNode from './SborNode.vue'

export default {
  name: 'MainComponent',
  components: { SborNode },
  setup() {
    const ordersSbors = ref([])
    const tableFields = ref([])

    const loadOrders = async () => {
      try {
        const data = await fetchOrders()
        ordersSbors.value = data.table.data.filter((item) => item.is_sbor)
        tableFields.value = data.table.fields
      } catch (error) {
        console.error('Ошибка при загрузке сборок:', error)
      }
    }

    onMounted(loadOrders)

    return { ordersSbors, tableFields }
  },
}
</script>

<style scoped>
.table {
  margin-bottom: 20px;
}
</style>
