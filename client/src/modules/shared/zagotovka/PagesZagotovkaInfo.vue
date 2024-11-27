<template>
  <div>
    <h1>{{ zagotovka?.title || 'Информация о заготовке' }}</h1>
    <div v-if="zagotovka">
      <div v-for="(field, key) in zagotovka.fields" :key="key">
        <p v-if="field.permissions.read">
          <strong>{{ field.title }}:</strong>
          <span v-if="typeof zagotovka.data[key] !== 'object'">
            {{ zagotovka.data[key] }}
          </span>
          <span v-else>
            <span v-for="(val, subKey) in zagotovka.data[key]" :key="subKey">
              {{ subKey }}: {{ val }}
            </span>
          </span>
        </p>
      </div>
    </div>
    <div v-else>
      <p>Загрузка данных о заготовке...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getZagotovkaInfo } from './api/zagotovka'

const zagotovka = ref(null)
const route = useRoute()

const fetchData = async (params) => {
  try {
    zagotovka.value = await getZagotovkaInfo(params)
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
