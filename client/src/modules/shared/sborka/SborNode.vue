<template>
  <tr
    @click.stop="toggle"
    :class="{ 'table-info': isExpanded, 'fw-bold': isExpanded }"
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

      <span v-else :title="generateTitle(field)" style="font-size: 13px">
        {{ formatValue(sbor[field.name], field.name) }}
      </span>
    </td>
  </tr>

  <template v-if="isExpanded && hasChildren">
    <SborNode
      v-for="child in sbor.sbor_tree"
      :key="child.ordersnom_id"
      :sbor="child"
      :fields="fields"
      :depth="depth + 1"
    />
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { Field, Sbor } from './SborNode.types'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@/utils/icons.ts'
import formatters from '@/utils/formatters.ts'
import { statuses } from '@/modules/shared/statuses.js'

export default defineComponent({
  name: 'SborNode',
  components: { FontAwesomeIcon },
  props: {
    sbor: { type: Object as () => Sbor, required: true },
    fields: {
      type: [Object, Array] as () => Record<string, Field> | Field[],
      required: true,
    },
    depth: { type: Number, default: 0 },
  },
  setup(props) {
    const router = useRouter()
    const isExpanded = ref(false)

    const fieldsArray = computed(() => {
      return Array.isArray(props.fields)
        ? props.fields
        : Object.keys(props.fields).map((key) => ({
            name: key,
            ...props.fields[key],
          }))
    })

    const firstField = computed(() => fieldsArray.value[0])

    const toggle = () => {
      if (hasChildren.value) isExpanded.value = !isExpanded.value
    }

    const handleRowClick = () => {
      router.push({
        name: 'OrderDetailsDetails',
        params: { id: props.sbor.ordersnom_id },
      })
    }

    const hasChildren = computed(
      () => props.sbor.sbor_tree && props.sbor.sbor_tree.length > 0
    )
    const formatValue = (
      value: string | number | boolean | null,
      fieldName: string
    ) => formatters.formatValue(value, fieldName)

    const generateTitle = (field: Field) =>
      `Поле: ${field.title || 'Нет данных'}`

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
