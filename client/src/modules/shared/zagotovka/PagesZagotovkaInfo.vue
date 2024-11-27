<template>
  <div class="container mt-4">
    <h1 class="mb-4">{{ zagotovka?.title || 'Информация о заготовке' }}</h1>
    <div v-if="zagotovka && zagotovka.fields">
      <table class="table table-bordered table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Название</th>
            <th scope="col">Значение</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(field, key) in zagotovka.fields || []" :key="key">
            <td class="fw-bold">{{ field.title }}</td>
            <td>
              <span v-if="typeof zagotovka.data[key] !== 'object'">
                {{ zagotovka.data[key] }}
              </span>
              <span v-else>
                <div
                  v-for="(val, subKey) in zagotovka.data[key]"
                  :key="subKey"
                  class="mb-1"
                >
                  {{ subKey }}: {{ val }}
                </div>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p class="text-muted">Загрузка данных о заготовке...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getZagotovkaInfo } from './api/zagotovka'

const zagotovka = ref({
  title: '',
  fields: [],
  data: {},
})

const route = useRoute()

const fetchData = async (params) => {
  try {
    const data = await getZagotovkaInfo(params)
    zagotovka.value = data
  } catch (error) {
    console.error('Ошибка при загрузке информации о заготовке:', error)
  }
}

onMounted(() => {
  const params = {
    type: route.query.type || 'tech',
    kolvo_add: parseFloat(route.query.kolvo_add) || 36.3,
    id: parseInt(route.query.id, 10) || 51567,
  }
  fetchData(params)
})
</script>
