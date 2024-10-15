<template>
  <div class="sbor-component">
    <h5 class="sbor-title">Сборка: {{ sbor.name }} ({{ sbor.description }})</h5>
    <table class="table table-sm">
      <thead>
      <tr>
        <th>Параметр</th>
        <th>Значение</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Количество</td>
        <td>{{ sbor.kolvo }}</td>
      </tr>
      <tr v-if="sbor.ordersnom__kolvo_add">
        <td>С браком</td>
        <td>{{ sbor.ordersnom__kolvo_add }}</td>
      </tr>
      <tr>
        <td>Стратегия</td>
        <td>{{ sbor.strat || 'Не указано' }}</td>
      </tr>
      <tr v-if="sbor.prod_price_w_sbor_det">
        <td>Цена сборки на ед.</td>
        <td>{{ sbor.prod_price_w_sbor_det }}</td>
      </tr>
      <tr v-if="sbor.p_m_t_p_out_price_det">
        <td>Цена за 1 шт. с м/о, Т/О, аутсорс</td>
        <td>{{ sbor.p_m_t_p_out_price_det }}</td>
      </tr>
      <tr>
        <td>Итого</td>
        <td>{{ sbor.prod_sbor_no_cal_instr }}</td>
      </tr>
      </tbody>
    </table>

    <!-- Рекурсивное отображение дочерних элементов -->
    <div v-if="sbor.sbor_tree && sbor.sbor_tree.length > 0" class="sbor-tree">
      <h6 class="mt-3">Составные части:</h6>
      <div v-for="childSbor in sbor.sbor_tree" :key="childSbor.name" class="child-sbor">
        <!-- Рекурсивный вызов компонента -->
        <SborComponent :sbor="childSbor" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SborComponent',
  props: {
    sbor: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
.sbor-component {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.sbor-title {
  font-weight: bold;
}

.child-sbor {
  margin-left: 20px;
  border-left: 2px solid #ccc;
  padding-left: 10px;
}

.table {
  margin-bottom: 0;
}
</style>
