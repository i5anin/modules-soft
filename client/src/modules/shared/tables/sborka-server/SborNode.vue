<template>
  <tr
    @click="toggle"
    :class="{ 'table-info': isExpanded, 'fw-bold': isExpanded }"
    style="table-layout: fixed"
  >
    <!-- Иконка разворачивания/сворачивания -->
    <td
      :style="{ width: '40px', textAlign: 'center', verticalAlign: 'middle' }"
    >
      <span
        v-if="hasChildren"
        title="Развернуть/Свернуть"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
      >
        <font-awesome-icon
          :icon="isExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
          class="icon-sm"
        />
      </span>
    </td>

    <!-- Статусы -->
    <td
      :style="{ width: '40px', textAlign: 'center', verticalAlign: 'middle' }"
    >
      <span
        v-html="combinedStatuses"
        style="display: inline-flex"
        data-bs-toggle="tooltip"
        :data-bs-title="'Активные статусы: ' + statusTooltip"
      ></span>
    </td>

    <!-- Поля -->
    <td
      v-for="field in fieldsArray"
      :key="field.name || 'default-key'"
      :style="{
        fontSize: '12px',
        verticalAlign: 'middle',
        textAlign: getTextAlignment(field.type || 'string', field.name || ''),
      }"
    >
      <!-- Основное поле (например, 'name') -->
      <div
        v-if="field.name === 'name'"
        class="tree-node"
        :style="{ paddingLeft: `${depth * 20}px`, position: 'relative' }"
      >
        <span data-bs-toggle="tooltip" :data-bs-title="generateTitle(field)">
          {{
            formatValue(
              sbor[field.name] || '',
              field.type || 'string',
              field.name || ''
            )
          }}
        </span>
      </div>
      <!-- Остальные поля -->
      <span
        v-else
        :title="generateTitle(field)"
        data-bs-toggle="tooltip"
        style="font-size: 13px"
      >
        {{
          formatValue(
            sbor[field.name] || '',
            field.type || 'string',
            field.name || ''
          )
        }}
      </span>
    </td>
  </tr>
  <!-- Рекурсивный вызов для дочерних узлов -->
  <template v-if="isExpanded && hasChildren">
    <SborNode
      v-for="(child, index) in sbor.sbor_tree"
      :key="child.ordersnom_id"
      :sbor="child"
      :fields="fields"
      :depth="depth + 1"
      :isLastChild="index === sbor.sbor_tree.length - 1"
      :detail="{ route: detail.route, idKey: detail.idKey }"
    />
  </template>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { Tooltip } from 'bootstrap'
import { useRouter } from 'vue-router'
import { store } from './store.js'
import { FontAwesomeIcon } from '@/utils/icons.js'
import { formatValue, getTextAlignment } from '@/utils/formatters.js'
import { statuses } from '@/modules/shared/logic/statuses.js'
import './SborNode.css'

export default {
  name: 'SborNode',
  components: { FontAwesomeIcon },
  props: {
    sbor: { type: Object, required: true },
    depth: { type: Number, default: 0 },
    fields: { type: Array, default: () => [] },
    isLastChild: { type: Boolean, default: false },
    detail: {
      type: Object,
      required: true,
      default: () => ({ route: '', idKey: '' }),
    },
  },
  setup(props) {
    const sborStore = store()
    const router = useRouter()
    const isExpanded = ref(false)

    const toggle = () => {
      if (hasChildren.value) {
        isExpanded.value = !isExpanded.value
      }
    }

    const handleRowClick = () => {
      const id = props.sbor[props.detail.idKey]
      if (props.detail.route && id) {
        router
          .push({ name: props.detail.route, params: { id } })
          .then(() => console.log('Navigation successful'))
          .catch((error) => console.error('Navigation error:', error))
      }
    }

    const hasChildren = computed(
      () => props.sbor.sbor_tree && props.sbor.sbor_tree.length > 0
    )
    const fieldsArray = computed(() => sborStore.filteredFields)
    const firstField = computed(() => fieldsArray.value[0])
    const combinedStatuses = computed(() => {
      const activeStatuses = statuses.filter(
        (status) =>
          props.sbor[status.status] && props.sbor[status.status].trim()
      )
      return activeStatuses.length > 0
        ? activeStatuses
            .map(
              (s) =>
                `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`
            )
            .join('')
        : ''
    })

    const statusTooltip = computed(() =>
      statuses
        .filter((status) => props.sbor[status.status])
        .map((status) => status.label)
        .join(', ')
    )

    const generateTitle = (field) =>
      `Поле: ${field.title || 'No data'}\nПеременная: ${field.name || 'No data'}`

    // Инициализация Bootstrap tooltips
    onMounted(() => {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      )
      tooltipTriggerList.map(
        (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
      )
    })

    return {
      isExpanded,
      toggle,
      handleRowClick,
      fieldsArray,
      firstField,
      combinedStatuses,
      hasChildren,
      formatValue,
      getTextAlignment, // Делаем функцию доступной в шаблоне
      generateTitle,
      statusTooltip,
    }
  },
}
</script>

<style>
.tooltip-inner {
  white-space: pre-line; /* Учитывать переносы \n */
  text-align: left; /* Выравнивание текста по левому краю */
}
</style>
