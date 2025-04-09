<template>
  <div>
    <div class="grid-container mt-3">
      <div :class="{ collapsed: isCollapsed }">
        <OrderInfoCard :header="headerData" />
      </div>
      <div class="sbor-main">
        <SborMain
          v-if="nomTableData.length > 0"
          :table-data="nomTableData"
          :table-fields="filteredTableFields"
          :detail="detail"
          :status-field="statusFieldPresent"
          :is-sbor-field="isSborPresent"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed, defineProps, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { getNomById } from '@/shared/api/nom_list.js'
  import OrderInfoCard from '@/features/form-2-card-noms/components/Form2CardNoms.vue'
  import { useRoleStore } from '@/modules/main/store/store.js'
  import SborMain from '@/shared/tables/sborka/SborMain.vue'

  // Пропсы
  const props = defineProps({
    type: { type: String, required: true },
    route: { type: String, required: true },
    statusField: { type: Object, required: true, default: true },
  })

  // Маршруты и стор
  const router = useRouter()
  const roleStore = useRoleStore()

  // Реактивные переменные
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
    const hasStatusField = Object.keys(tableFields.value).some((key) =>
      key.toLowerCase().includes('status')
    )
    const hasSborData = nomTableData.value.some((item) => item.is_sbor === true)
    return hasStatusField && hasSborData
  })

  const fetchOrderData = async () => {
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
    }
  }

  const filteredTableFields = computed(() => {
    return Object.entries(tableFields.value)
      .filter(([, field]) => field.permissions?.read)
      .map(([key, field]) => ({
        name: key,
        ...field,
      }))
  })

  // Инициализация данных
  onMounted(fetchOrderData)
</script>
<style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 270px 1fr;
    gap: 4px;
  }
</style>
