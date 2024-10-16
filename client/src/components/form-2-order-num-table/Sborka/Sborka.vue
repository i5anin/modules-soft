<template>
  <div class="container-fluid">
    <h1>Сборка</h1>
    <div class="row">
      <div class="col-12">
        <table class="table table-striped table-sm table-hover">
          <thead>
            <tr>
              <th
                scope="col"
                v-for="field in filteredFields"
                :key="field.name"
                :style="{ width: allowedFields[field.name]?.width }"
              >
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

    // Определяем фиксированные ширины полей
    const allowedFields = {
      name: { width: '100px' },
      description: { width: '100px' },
      kolvo: { width: '100px' },
      procent: { width: '50px' },
      term_price_det: { width: '100px' },
      prod_price_det: { width: '100px' },
      metall_price_total_det: { width: '100px' },
      outsource_price_det: { width: '100px' },
      prod_price_w_sbor_det: { width: '100px' },
      prod_time: { width: '100px' },
      p_m_t_p_out_price_det: { width: '100px' },
      p_m_t_p_out_price: { width: '100px' },
      prod_sbor_no_cal_instr_det: { width: '100px' },
      prod_sbor_no_cal_instr: { width: '100px' },
      norma: { width: '100px' },

      // Новые ключи из JSON
      ordersnom__kolvo_add: { width: '100px' },
      mats_from: { width: '100px' },
      imp: { width: '100px' },
      strat: { width: '100px' },
      prod_price: { width: '100px' },
      tpd: { width: '100px' },
      p_price_det: { width: '100px' },
      prod_price_w_sbor: { width: '100px' },
    }

    const loadOrders = async () => {
      try {
        const data = await fetchOrders()
        ordersSbors.value = data.table.data.filter((item) => item.is_sbor)
        tableFields.value = data.table.fields
      } catch (error) {
        console.error('Ошибка при загрузке сборок:', error)
      }
    }

    const filteredFields = computed(() => {
      return tableFields.value.filter((field) =>
        Object.keys(allowedFields).includes(field.name)
      )
    })

    onMounted(loadOrders)

    return { ordersSbors, filteredFields, allowedFields }
  },
}
</script>

<style scoped>
.table {
  margin-bottom: 20px;
}
</style>
