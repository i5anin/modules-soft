<template>
  <div class="container-fluid">
    <h1>Сборка</h1>
    <div class="row">
      <div class="col-12">
        <!-- Таблица для отображения сборок -->
        <table class="table table-bordered table-striped">
          <thead>
          <tr>
            <th>Название сборки</th>
            <th>Описание</th>
            <th>Количество</th>
            <th>Сборка</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="sbor in ordersSbors" :key="sbor.sbor_orders__id">
            <td>{{ sbor.name }}</td>
            <td>{{ sbor.description }}</td>
            <td>{{ sbor.kolvo }}</td>
            <td>{{ sbor.is_sbor ? 'Да' : 'Нет' }}</td>
          </tr>
          </tbody>
        </table>

        <!-- Рекурсивное отображение дерева сборок -->
        <div v-for="sbor in ordersSbors" :key="sbor.sbor_orders__id">
          <div v-if="sbor.sbor_tree && sbor.sbor_tree.length">
            <h6>Дерево сборки для {{ sbor.name }}</h6>
            <SborComponent :sbor="sbor" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import SborComponent from './SborNode.vue';

export default {
  components: { SborComponent },
  setup() {
    const ordersSbors = ref([]);

    const fetchOrders = () => {
      return axios.get('http://localhost:8002/api/nom_list', {
        params: {
          id: 1840,
          type: 'orders',
          module: 'tech_calc'
        }
      })
          .then(response => {
            ordersSbors.value = response.data.table.data.filter(item => item.is_sbor);
          })
          .catch(error => {
            console.error('Ошибка при загрузке сборок:', error);
          });
    };

    onMounted(() => {
      fetchOrders();
    });

    return {
      ordersSbors
    };
  }
};
</script>

<style scoped>
.table {
  margin-bottom: 20px;
}
</style>
