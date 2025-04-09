<template>
  <tr
    :class="{ 'expanded-row': isExpanded, 'fw-bold': isExpanded }"
    style="table-layout: fixed"
  >
    <!--region Иконка разворачивания-->
    <td v-if="isSborField" :style="cellStyle" @click="toggle">
      <span v-if="hasChildren" title="Развернуть/Свернуть">
        <font-awesome-icon
          :icon="isExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
        />
      </span>
    </td>
    <!--endregion-->
    <!--region Статусы-->
    <td v-if="statusField" :style="cellStyle">
      <StatusDisplay :row="sbor" />
    </td>
    <!--endregion-->
    <!--region Поля-->
    <td
      v-for="(field, colIndex) in fields"
      v-show="rowSpanMatrix[rowIndex][colIndex] !== -1"
      :key="field.name"
      :rowspan="rowSpanMatrix[rowIndex][colIndex]"
      :style="getFieldStyle(field)"
    >
      <div v-if="field.permissions.update = 0">
        <input
          v-model="sbor[field.name]"
          type="text"
          class="form-control form-control-sm"
          :style="{ fontSize: '14px' }"
          @click.stop
          @blur="handleFieldBlur(field)"
        />
      </div>
      <div v-else>
        <div
          v-if="field.name === 'name' || field.name === 'description'"
          class="tree-node"
          :style="getTreeNodeStyle(field)"
          title="Нажмите для перехода"
          @click.stop="handleRowClick"
        >
          <div
            v-if="field.name === 'name' && depth > 0"
            class="branch-line"
            :class="{ 'last-child': isLastChild }"
            :style="{ left: `${(depth - 1) * 20}px` }"
          />
          <font-awesome-icon
            v-if="field.name === 'name'"
            :icon="sbor.is_sbor ? ['fas', 'cubes'] : ['fas', 'cube']"
            :style="{ color: sbor.is_sbor ? '#dc6611' : '#cfa614' }"
            class="icon-sm me-2"
          />
          <span
            v-html="formatValue(sbor[field.name], field.type, field.name)"
          />
        </div>
        <StrategyDisplay
          v-else-if="field.name === 'strat'"
          :strategy="sbor[field.name]"
          :depth="depth"
        />
        <span
          v-else
          :title="generateTitle(field)"
          style="font-size: 13px"
          v-html="formatValue(sbor[field.name], field.type, field.name)"
        />
      </div>
    </td>
    <!--endregion-->
  </tr>
  <!--region Рекурсивный вызов для дочерних узлов-->
  <template v-if="isExpanded && hasChildren">
    <SborRow
      v-for="(child, index) in sbor.sbor_tree"
      :key="child.id"
      :sbor="child"
      :fields="fields"
      :depth="depth + 1"
      :is-last-child="index === sbor.sbor_tree.length - 1"
      :detail="detail"
      :row-index="index"
      :row-span-matrix="rowSpanMatrix"
      :status-field="statusField"
      :is-sbor-field="isSborField"
    />
  </template>
  <!--endregion-->
</template>

<script setup>
  import { computed, ref, toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  import { FontAwesomeIcon } from '@/utils/icons.js'
  import { formatValue, getTextAlignment } from '@/utils/formatters.js'
  import StatusDisplay from '@/shared/components/ui/StatusDisplay.vue'
  import StrategyDisplay from '@/shared/components/ui/StrategyDisplay.vue'

  const props = defineProps({
    sbor: { type: Object, required: true },
    depth: { type: Number, default: 0 },
    fields: { type: Array, required: true },
    isLastChild: { type: Boolean, default: false },
    detail: { type: Object, required: true },
    rowIndex: { type: Number, required: true },
    rowSpanMatrix: { type: Array, required: true },
    statusField: { type: Object, required: true },
    isSborField: { type: Object, required: true },
  })

  const { sbor, detail } = toRefs(props)
  const router = useRouter()
  const isExpanded = ref(false)

  // Стили ячеек
  const cellStyle = {
    width: '40px',
    textAlign: 'center',
    verticalAlign: 'middle',
  }
  // Переключение строки
  const toggle = () => {
    if (hasChildren.value) {
      isExpanded.value = !isExpanded.value
    }
  }

  // Проверка наличия дочерних элементов
  const hasChildren = computed(() => sbor.value.sbor_tree?.length > 0)

  // Переход по строке
  const handleRowClick = () => {
    const id = sbor.value.link_id
    if (!id) {
      console.error('Ошибка: отсутствует ID для перехода', {
        id,
        sbor: sbor.value,
      })
      return
    }

    router
      .push({ name: detail.value.route, params: { nom_id: id } })
      .catch((error) => {
        console.error('Ошибка при навигации:', error)
      })
  }

  // Генерация заголовка
  const generateTitle = (field) =>
    `Поле: ${field.title || 'Нет данных'}\nПеременная: ${field.name || 'Нет данных'}`

  // Стили ячеек
  const getFieldStyle = (field) => ({
    fontSize: '12px',
    verticalAlign: 'middle',
    textAlign: getTextAlignment(field.type, field.name),
  })

  // Стили для `tree-node`
  const getTreeNodeStyle = (field) => ({
    paddingLeft: field.name === 'name' ? `${props.depth * 20}px` : '0px',
    position: 'relative',
    cursor: 'pointer',
  })
</script>

<style>
  .tree-node {
    display: flex;
    align-items: center;
    position: relative;
  }

  .node-content {
    display: flex;
    align-items: center;
  }

  /* Стиль развернутой строки с прозрачным выделением */
  .expanded-row {
    background-color: rgb(255, 255, 255) !important; /* Нежный синий */
    color: #9cdcff;
  }

  /* Улучшенное выделение текста */
  .expanded-row td {
    color: inherit;
  }

  .branch-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20px;
  }

  .branch-line::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 1px;
  }

  .branch-line::after {
    content: '';
    position: absolute;
    left: 10px;
    top: 50%;
    width: 10px;
    height: 1px;
  }

  .last-child .branch-line::before {
    height: 50%;
  }
</style>
