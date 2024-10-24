<template>
  <div class="container-fluid">
    <h1>Сборка</h1>
    <div class="row">
      <div class="col-12">
        <div v-if="nomtable.length === 0" class="alert alert-warning">
          Нет данных для отображения.
        </div>
        <table v-else class="table table-striped table-sm table-hover">
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
              <th scope="col" style="width: 150px">Статусы</th>
            </tr>
          </thead>
          <tbody>
            <SborNode
              v-for="sbor in nomtable"
              :key="sbor.sbor_orders__id"
              :sbor="sbor"
              :fields="filteredFields"
              :depth="0"
            ></SborNode>
          </tbody>
        </table>
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
      ordersnom__kolvo_add: { width: '100px' },
      mats_from: { width: '100px' },
      imp: { width: '100px' },
      prod_price: { width: '100px' },
      tpd: { width: '100px' },
      p_price_det: { width: '100px' },
      prod_price_w_sbor: { width: '100px' },
    }

    const filteredFields = computed(() => {
      return props.tableFields.filter((field) =>
        Object.keys(allowedFields).includes(field.name)
      )
    })

    return { filteredFields, allowedFields }
  },
}
</script>
