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
import { fetchOrders } from '@/api/orders.js'; // Импортируем функцию из api
import SborNode from './SborNode.vue';

export default {
  name: 'MainComponent',
  components: { SborNode },
  setup() {
    const ordersSbors = ref([]);

    const loadOrders = async () => {
      try {
        const data = await fetchOrders(); // Получаем данные от API
        ordersSbors.value = data.table.data.filter(item => item.is_sbor); // Фильтруем и сохраняем в переменной
      } catch (error) {
        console.error('Ошибка при загрузке сборок:', error);
      }
    };

    onMounted(loadOrders);

    return { ordersSbors };
  },
};
</script>

<style scoped>
.table {
  margin-bottom: 20px;
}
</style>
