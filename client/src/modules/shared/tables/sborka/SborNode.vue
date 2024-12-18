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
          <span
            v-html="formatValue(sbor[field.name], field.type, field.name)"
          ></span>
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            :style="{ color: 'green' }"
            class="icon-sm ms-2 me-2"
            @click.stop="handleRowClick"
          />
        </div>
      </div>

      <div
        v-else-if="field.name === 'strat'"
        class="tree-node"
        :style="{ paddingLeft: `${depth * 20}px`, position: 'relative' }"
        @click.stop="toggleStrat"
      >
        <div class="node-content">
          <span v-if="!isStratExpanded">
            <div class="mini-strategy">
              <span
                v-for="entry in Object.entries(sbor[field.name])"
                :key="entry[0]"
                :style="{
                  backgroundColor: entry[1].color || '#aaaaaa',
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  margin: '0 2px',
                }"
              >
                <div
                  :style="{
                    fontSize: '8px',
                    color: 'white',
                    transform: 'translate(5%, 11%)',
                    fontWeight: 'bold',
                  }"
                >
                  {{ entry[0] }}
                </div></span
              >
            </div>
          </span>
          <span v-else v-html="formatStrategy(sbor[field.name])"></span>
        </div>
      </div>

      <span
        v-else
        v-html="formatValue(sbor[field.name], field.type, field.name)"
        :title="generateTitle(field)"
        style="font-size: 13px"
      ></span>
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
import { computed, ref, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from './store.js'
import { FontAwesomeIcon } from '@/utils/icons.js'
import {
  formatValue,
  getTextAlignment,
  formatStrategy,
} from '@/utils/formatters.js'
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
    const { sbor, detail } = toRefs(props)
    const sborStore = store()
    const router = useRouter()
    const isExpanded = ref(false)
    const isStratExpanded = ref(false)

    watch(
      detail,
      (newDetail) => {
        if (!newDetail.route || !newDetail.idKey) {
          console.warn(
            'Detail prop is missing or incomplete. Expected { route: "", idKey: "" }.',
            newDetail
          )
        }
      },
      { immediate: true }
    )

    const toggle = () => {
      if (hasChildren.value) {
        isExpanded.value = !isExpanded.value
      }
    }

    const toggleStrat = () => {
      if (sbor.value.strat) {
        isStratExpanded.value = !isStratExpanded.value
      }
    }

    const handleRowClick = () => {
      const idKey = detail.value.idKey
      const id = sbor.value[idKey]

      if (!id) {
        console.error('Missing required parameter: id', {
          id,
          sbor: sbor.value,
        })
        return
      }

      router
        .push({
          name: detail.value.route,
          params: { [idKey]: id, nom_id: id },
        })
        .catch((error) => {
          console.error('Error navigating to route:', error)
        })
    }

    const hasChildren = computed(
      () => sbor.value.sbor_tree && sbor.value.sbor_tree.length > 0
    )

    const fieldsArray = computed(() => sborStore.filteredFields)

    const generateTitle = (field) =>
      `Поле: ${field.title || 'Нет данных'}\nПеременная: ${field.name || 'Нет данных'}`

    return {
      isExpanded,
      toggle,
      toggleStrat,
      handleRowClick,
      fieldsArray,
      hasChildren,
      formatValue,
      formatStrategy,
      generateTitle,
      getTextAlignment,
      isStratExpanded,
    }
  },
}
</script>
