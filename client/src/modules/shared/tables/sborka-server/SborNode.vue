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
      :key="field.name"
      :style="{
        fontSize: '12px',
        verticalAlign: 'middle',
        textAlign: getTextAlignment(field.type, field.name),
      }"
    >
      <div
        v-if="field === firstField"
        class="tree-node"
        :style="{ paddingLeft: `${depth * 20}px`, position: 'relative' }"
      >
        <!-- Ветвь связей -->
        <div
          v-if="depth > 0"
          class="branch-line"
          :class="{ 'last-child': isLastChild }"
          :style="{ left: `${(depth - 1) * 20}px` }"
        ></div>

        <!-- Содержимое узла -->
        <div class="node-content">
          <font-awesome-icon
            :icon="sbor.is_sbor ? ['fas', 'cubes'] : ['fas', 'cube']"
            :style="{ color: sbor.is_sbor ? '#dc6611' : '#cfa614' }"
            class="icon-sm me-2"
          />
          <span data-bs-toggle="tooltip" :data-bs-title="generateTitle(field)">
            {{ formatValue(sbor[field.name], field.type) }}
          </span>
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            :style="{ color: 'green' }"
            class="icon-sm ms-2 me-2"
            @click.stop="handleRowClick"
            data-bs-toggle="tooltip"
            title="Дополнительная информация"
          />
        </div>
      </div>
      <span
        v-else
        :title="generateTitle(field)"
        data-bs-toggle="tooltip"
        style="font-size: 13px"
      >
        {{ formatValue(sbor[field.name], field.type, field.name) }}
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
import { formatValue } from '@/utils/formatters.js'
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
      console.log('handleRowClick called') // Лог вызова метода
      const id = props.sbor[props.detail.idKey]
      console.log('Extracted nomId:', id) // Лог извлеченного идентификатора

      if (props.detail.route && id) {
        console.log(
          'Attempting to navigate to route:',
          props.detail.route,
          'with params:',
          { id }
        )
        router
          .push({ name: props.detail.route, params: { id } })
          .then(() => console.log('Navigation successful')) // Лог успешной навигации
          .catch((error) => console.error('Navigation error:', error)) // Лог ошибок навигации
      } else {
        console.warn(
          'Navigation skipped. Reason:',
          !props.detail.route ? 'Missing route' : 'Missing nomId'
        )
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
