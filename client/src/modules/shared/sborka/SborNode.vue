<template>
  <!-- Строка для текущего элемента `sbor` -->
  <tr
    @click.stop="toggle"
    :class="{
      'table-info': isExpanded,
      'fw-bold': isExpanded,
    }"
    style="table-layout: fixed"
  >
    <!-- Колонка для иконки раскрытия дерева -->
    <td :style="{ width: '40px', textAlign: 'center' }">
      <span v-if="hasChildren" title="развернуть/свернуть">
        <font-awesome-icon
          :icon="isExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
          class="icon-sm"
        />
      </span>
    </td>
    <!-- Колонка для статусов -->
    <td>
      <span v-html="combinedStatuses" style="display: inline-flex"></span>
    </td>

    <!-- Поля, отображаемые для текущего `sbor`, с учетом структуры `fields` -->
    <td
      v-for="[fieldName, field] in Object.entries(fields)"
      :key="fieldName"
      style="cursor: pointer; font-size: 12px"
    >
      <span
        v-if="fieldName === firstFieldName"
        style="display: inline-flex; align-items: center; min-width: 100%"
        :style="{ paddingLeft: `${depth * 35}px` }"
      >
        <!-- Иконка для обозначения типа элемента -->
        <font-awesome-icon
          :icon="sbor.is_sbor ? ['fas', 'cubes'] : ['fas', 'cube']"
          :style="{ color: sbor.is_sbor ? '#dc6611' : '#cfa614' }"
          class="icon-sm ms-2 me-2"
        />
        <span>{{ formatValue(sbor[fieldName], fieldName) }}</span>
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          :style="{ color: 'green' }"
          class="icon-sm ms-2 me-2"
          @click.stop="handleRowClick"
        />
      </span>
      <!-- Остальные поля -->

      <span v-else :title="generateTitle(field)" style="font-size: 13px">
        {{ formatValue(sbor[fieldName], fieldName) }}
      </span>
    </td>
  </tr>

  <!-- Рекурсивное отображение для каждого элемента в `sbor_tree` -->
  <template v-if="isExpanded && hasChildren">
    <SborNode
      v-for="child in sbor.sbor_tree"
      :key="child.sbor_orders__id"
      :sbor="child"
      :fields="fields"
      :depth="depth + 1"
    />
  </template>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@/utils/icons.js'
import formatters from '@/utils/formatters.js'
import { statuses } from '@/modules/shared/statuses.js'

export default {
  name: 'SborNode',
  components: {
    FontAwesomeIcon,
  },
  props: {
    sbor: {
      type: Object,
      required: true,
    },
    fields: {
      type: Object, // Теперь fields — объект, а не массив
      required: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const router = useRouter()
    const isExpanded = ref(false)
    const firstFieldName = Object.keys(props.fields)[0] // Имя первого поля

    const toggle = () => {
      if (hasChildren.value) {
        isExpanded.value = !isExpanded.value
      }
    }

    const handleRowClick = () => {
      const id = props.sbor.ordersnom_id
      router.push({ name: 'OrderDetailsDetails', params: { id } })
    }

    const hasChildren = computed(() => {
      return props.sbor.sbor_tree && props.sbor.sbor_tree.length > 0
    })

    const formatValue = (value, fieldName) => {
      return formatters.formatValue(value, fieldName)
    }

    const generateTitle = (field) => {
      return `Поле: ${field.title || 'Нет данных'}`
    }

    const combinedStatuses = computed(() => {
      const activeStatuses = statuses.filter(
        (status) =>
          props.sbor[status.status] && props.sbor[status.status].trim()
      )
      if (activeStatuses.length > 0) {
        return activeStatuses
          .map(
            (s) => `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`
          )
          .join('')
      } else {
        return ''
      }
    })

    return {
      isExpanded,
      toggle,
      handleRowClick,
      hasChildren,
      formatValue,
      generateTitle,
      firstFieldName,
      combinedStatuses,
    }
  },
}
</script>
