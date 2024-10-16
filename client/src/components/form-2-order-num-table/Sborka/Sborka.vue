<template>
  <div class="container-fluid">
    <h1>Сборка</h1>
    <div class="row">
      <div class="col-12">
        <!-- Динамическое отображение только разрешенных полей таблицы -->
        <table class="table table-hover">
          <thead>
            <tr>
              <th v-for="field in filteredFields" :key="field.name">
                {{ field.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <SborNode
              v-for="sbor in ordersSbors"
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
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { fetchOrders } from '@/api/orders.js'
import SborNode from './SborNode.vue'

export default {
  name: 'MainComponent',
  components: { SborNode },
  setup() {
    const ordersSbors = ref([])
    const tableFields = ref([])

    const allowedFields = [
      'name',
      'description',
      'kolvo',
      'term_price_det',
      'prod_price_det',
      'metall_price_total_det',
      'outsource_price_det',
      'prod_price_w_sbor_det',
    ]

    const loadOrders = async () => {
      try {
        const data = await fetchOrders()
        ordersSbors.value = data.table.data.filter((item) => item.is_sbor)
        tableFields.value = data.table.fields
      } catch (error) {
        console.error('Ошибка при загрузке сборок:', error)
      }
    }

    // Разрешаем только указанные поля
    const filteredFields = computed(() => {
      return tableFields.value.filter((field) =>
        allowedFields.includes(field.name)
      )
    })

    onMounted(loadOrders)

    return { ordersSbors, filteredFields }
  },
}
</script>

<style scoped>
.table {
  margin-bottom: 20px;
}
</style>
