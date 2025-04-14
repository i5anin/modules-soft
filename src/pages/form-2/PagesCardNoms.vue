<template>
  <div>
    <div class="grid-container mt-3">
      <div :class="{ collapsed: isCollapsed }">
        <OrderInfoCard v-if="!loading" :header="headerData" />
        <TableSkeleton v-else :row-count="20" />
      </div>

      <div class="sbor-main">
        <SborMain
          v-if="!loading && nomTableData.length > 0"
          :table-data="nomTableData"
          :table-fields="filteredTableFields"
          :detail="detail"
          :status-field="statusFieldPresent"
          :is-sbor-field="isSborPresent"
        />
        <TableSkeleton
          v-else
          :column-count="filteredTableFields?.length || 5"
          :row-count="5"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { getNomById } from '@/shared/api/nom_list.js'
  import OrderInfoCard from '@/features/form-2-card-noms/components/Form2CardNoms.vue'

  import SborMain from '@/shared/tables/sborka/SborMain.vue'
  import TableSkeleton from '@/shared/ui/LoadingTableSkeleton.vue'

  // Пропсы
  const props = defineProps({
    type: { type: String, required: true },
    route: { type: String, required: false, default: '' },
  })

  // Маршруты и стор
  const router = useRouter()

  // Реактивные переменные
  const loading = ref(true) // ✅ добавлено
  const nomTableData = ref([])
  const headerData = ref({})
  const tableFields = ref({})
  const isCollapsed = ref(false)

  // Вычисляемые свойства
  const detail = computed(() => ({
    route: props.route,
    idKey: 'link_id',
  }))

  const statusFieldPresent = computed(() => {
    return Object.keys(tableFields.value).some((key) =>
      key.toLowerCase().includes('status')
    )
  })

  const isSborPresent = computed(() => {
    return nomTableData.value.some((item) => item.is_sbor === true)
  })

  const filteredTableFields = computed(() => {
    return Object.entries(tableFields.value)
      .filter(([, field]) => field.permissions?.read)
      .map(([key, field]) => ({
        name: key,
        ...field,
      }))
  })

  // Загрузка данных
  const fetchOrderData = async () => {
    loading.value = true // ✅ перед началом запроса

    const link_id = router.currentRoute.value.params.id
    const queryParams = {
      id: link_id,
      type: props.type,
    }

    try {
      const { header, table } = await getNomById(queryParams)
      headerData.value = header
      tableFields.value = table.fields
      nomTableData.value = table.data
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error)
    } finally {
      loading.value = false // ✅ после завершения запроса
    }
  }

  // Инициализация
  onMounted(fetchOrderData)
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 270px 1fr;
    gap: 4px;
  }
</style>
