// src/components/OrderTable.vue
<template>
  <div>
    <table class="table table-striped">
      <thead>
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th>№</th>
        <th>Дата</th>
        <th class="bg-light">Контрагент</th>
        <th>Срок</th>
        <th>Менеджер</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td><input type="checkbox" :checked="order.status_ready" disabled></td>
        <td :class="{ 'table-danger': order.status_cal }">{{ order.status_cal }}</td>
        <td :class="{ 'table-warning': order.status_instr }">{{ order.status_instr }}</td>
        <td :class="{ 'table-secondary': order.status_draft }">{{ order.status_draft }}</td>
        <td :class="{ 'table-dark': order.status_metall }">{{ order.status_metall }}</td>
        <td :class="{ 'table-success': order.status_kp }">{{ order.status_kp }}</td>
        <td>{{ order.id }}</td>
        <td>{{ order.date }}</td>
        <td :class="{ 'table-success': order.goz }">{{ order.name }}</td>
        <td>{{ order.cal_buy_time }}</td>
        <td>{{ order.order_manager }}</td>
      </tr>
      </tbody>
    </table>

    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Предыдущая</button>
        </li>
        <li class="page-item active" aria-current="page">
          <span class="page-link">{{ currentPage }}</span>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Следующая</button>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
import { computed, onMounted, ref, watch } from 'vue';
import { useHomeStore } from '../store/home.module';
import { getOrders } from '../api/orders';

export default {
  setup() {
    const homeStore = useHomeStore();
    const orders = ref([]);
    const totalOrders = ref(0);

    const currentPage = computed(() => homeStore.currentPage);
    const totalPages = computed(() => Math.ceil(totalOrders.value / homeStore.itemsPerPage));

    const fetchOrders = async () => {
      try {
        const data = await getOrders(homeStore.currentPage, homeStore.itemsPerPage, homeStore.searchQuery);
        orders.value = data.orders;
        totalOrders.value = data.totalCount;
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      }
    };

    watch([currentPage, () => homeStore.searchQuery], fetchOrders);

    const nextPage = () => {
      if (homeStore.currentPage < totalPages.value) {
        homeStore.nextPage();
        console.log('Переход на следующую страницу. Текущая:', homeStore.currentPage);
      }
    };

    const prevPage = () => {
      if (homeStore.currentPage > 1) {
        homeStore.prevPage();
        console.log('Переход на предыдущую страницу. Текущая:', homeStore.currentPage);
      }
    };

    onMounted(fetchOrders);

    return {
      orders,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
    };
  },
};
</script>