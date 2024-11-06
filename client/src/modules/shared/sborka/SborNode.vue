<template>
  <tr
    @click.stop="toggle"
    :class="{
      'table-info': isExpanded,
      'fw-bold': isExpanded,
    }"
    style="table-layout: fixed"
  >
    <td :style="{ width: '40px', textAlign: 'center' }">
      <span v-if="hasChildren" title="развернуть/свернуть">
        <font-awesome-icon
          :icon="isExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
          class="icon-sm"
        />
      </span>
    </td>
    <td>
      <span v-html="combinedStatuses" style="display: inline-flex"></span>
    </td>

    <!-- Теперь `fieldsArray` содержит массив объектов полей -->
    <td
      v-for="field in fieldsArray"
      :key="field.name"
      style="cursor: pointer; font-size: 12px"
    >
      <span
        v-if="field === firstField"
        style="display: inline-flex; align-items: center; min-width: 100%"
        :style="{ paddingLeft: `${depth * 35}px` }"
      >
        <font-awesome-icon
          :icon="sbor.is_sbor ? ['fas', 'cubes'] : ['fas', 'cube']"
          :style="{ color: sbor.is_sbor ? '#dc6611' : '#cfa614' }"
          class="icon-sm ms-2 me-2"
        />
        <span>{{ formatValue(sbor[field.name], field.name) }}</span>
        <font-awesome-icon
          :icon="['fas', 'circle-info']"
          :style="{ color: 'green' }"
          class="icon-sm ms-2 me-2"
          @click="handleRowClick"
        />
      </span>

      <span v-else :title="generateTitle(field, sbor)" style="font-size: 13px">
        {{ formatValue(sbor[field.name], field.name) }}
      </span>
    </td>
  </tr>

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

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@/utils/icons.js'
import formatters from '@/utils/formatters.js'
import { statuses } from '@/modules/shared/statuses.js'
import { Field, Sbor } from './SborNode.types' // Импортируем типы из отдельного файла

export default defineComponent({
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
      type: Object,
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

    const fieldsArray = computed<Field[]>(() => {
      return Array.isArray(props.fields)
        ? props.fields
        : Object.keys(props.fields).map((key) => ({
            name: key,
            ...props.fields[key],
          }))
    })

    const firstField = computed(() => fieldsArray.value[0])

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

    const formatValue = (value: any, fieldName: string): string => {
      return formatters.formatValue(value, fieldName)
    }

    const generateTitle = (field: Field): string => {
      return `Поле: ${field.title || 'Нет данных'}`
    }

    const combinedStatuses = computed((): string => {
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
      firstField,
      combinedStatuses,
      fieldsArray,
    }
  },
})
</script>
