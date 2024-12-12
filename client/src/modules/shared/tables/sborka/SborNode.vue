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
      <span v-if="hasChildren" title="Развернуть/Свернуть">
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
      <StatusDisplay :row="sbor" />
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
        v-if="field.name === 'name'"
        class="tree-node"
        :style="{ paddingLeft: `${depth * 20}px`, position: 'relative' }"
      >
        <div
          v-if="depth > 0"
          class="branch-line"
          :class="{ 'last-child': isLastChild }"
          :style="{ left: `${(depth - 1) * 20}px` }"
        ></div>

        <div class="node-content">
          <font-awesome-icon
            :icon="sbor.is_sbor ? ['fas', 'cubes'] : ['fas', 'cube']"
            :style="{ color: sbor.is_sbor ? '#dc6611' : '#cfa614' }"
            class="icon-sm me-2"
          />
          <span>
            {{ formatValue(sbor[field.name], field.type, field.name) }}
          </span>
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            :style="{ color: 'green' }"
            class="icon-sm ms-2 me-2"
            @click.stop="handleRowClick"
          />
        </div>
      </div>
      <span v-else :title="generateTitle(field)" style="font-size: 13px">
        {{ formatValue(sbor[field.name], field.type, field.name) }}
      </span>
    </td>
  </tr>

  <!-- Рекурсивный вызов для дочерних узлов -->
  <template v-if="isExpanded && hasChildren">
    <SborNode
      v-for="(child, index) in sbor.sbor_tree"
      :key="child[detail.idKey]"
      :sbor="child"
      :fields="fields"
      :depth="depth + 1"
      :isLastChild="index === sbor.sbor_tree.length - 1"
      :detail="detail"
    />
  </template>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from './store.js'
import { FontAwesomeIcon } from '@/utils/icons.js'
import { formatValue, getTextAlignment } from '@/utils/formatters.js'
import StatusDisplay from '@/modules/shared/components/StatusDisplay.vue'
import './SborNode.css'

export default {
  name: 'SborNode',
  components: { FontAwesomeIcon, StatusDisplay },
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
      const idKey = props.detail.idKey
      const id = idKey && props.sbor ? props.sbor[idKey] : null
      const f2id = props.sbor?.f2id // Дополнительно извлекаем f2id
      console.log(f2id)
      console.log(props.sbor)

      if (!id) {
        console.error('Missing required parameter: id', {
          f2id,
          sbor: props.sbor,
        })
        return
      }

      router
        .push({
          name: props.detail.route,
          params: { [idKey]: id, f2id }, // Добавляем f2id в параметры маршрута
        })
        .catch(console.error)
    }

    const hasChildren = computed(
      () => props.sbor.sbor_tree && props.sbor.sbor_tree.length > 0
    )

    const fieldsArray = computed(() => sborStore.filteredFields)

    const generateTitle = (field) => `Поле: ${field.title || 'Нет данных'}`

    return {
      isExpanded,
      toggle,
      handleRowClick,
      fieldsArray,
      hasChildren,
      formatValue,
      generateTitle,
      getTextAlignment,
    }
  },
}
</script>
