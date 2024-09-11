<template>
  <div v-if="order">
    <h2>Детали заказа #{{ order.id }}</h2>
    <p>Контрагент: {{ order.name }}</p>
    <p>Дата: {{ order.date }}</p>
    <!-- Отобразите другие детали заказа -->

    <button @click="openModal = true" class="btn btn-primary mt-3">
      Открыть модальное окно
    </button>

    <OrderDetailsModal :order="order" v-model:show="openModal" />
  </div>
  <p v-else>Загрузка заказа...</p>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getOrderById } from '../api/orders'; // Путь к вашему файлу с API
import OrderDetailsModal from './OrderDetailsModal.vue';

export default {
  components: {
    OrderDetailsModal
  },
  setup() {
    const route = useRoute();
    const orderId = ref(route.params.orderId);
    const order = ref(null);
    const openModal = ref(false);

    onMounted(async () => {
      try {
        order.value = await getOrderById(orderId.value);
      } catch (error) {
        console.error('Ошибка при загрузке заказа:', error);
      }
    });

    return { order, openModal };
  }
};
</script>