<!-- MainComponent.vue -->
<template>
  <div class="container-fluid">
    <h1>Сборка</h1>
    <div class="row">
      <div class="col-12">
        <!-- Рекурсивное отображение дерева сборок -->
        <table class="table table-bordered table-striped">
          <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Количество</th>
            <th>Сборка</th>
          </tr>
          </thead>
          <tbody>
          <SborNode v-for="sbor in ordersSbors"
                    :key="sbor.sbor_orders__id"
                    :sbor="sbor"
                    :depth="0" />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import SborNode from './SborNode.vue';

export default {
  name: 'MainComponent',
  components: { SborNode },
  setup() {
    const ordersSbors = ref([]);

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8002/api/nom_list', {
          params: {
            id: 1840,
            type: 'orders',
            module: 'tech_calc',
          },
        });
        ordersSbors.value = response.data.table.data.filter(item => item.is_sbor);
      } catch (error) {
        console.error('Ошибка при загрузке сборок:', error);
      }
    };

    onMounted(fetchOrders);

    return { ordersSbors };
  },
};
</script>

<style scoped>
.table {
  margin-bottom: 20px;
}
</style>
