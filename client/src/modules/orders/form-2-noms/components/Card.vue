<template>
  <div>
    <div v-if="header" class="card border-light mb-2">
      <div class="card-header bg-transparent border-success border-light p-2">
        <span class="mdi mdi-format-list-bulleted-type"></span>
        <svg-icon type="mdi" :path="mdiFormatListBulletedType" color="red" />
        Информация о заказе {{ fieldValues['orders__id'] || '' }}
      </div>
      <div class="card-body p-2">
        <div class="row g-3">
          <div v-for="(field, name) in allFields" :key="name" class="col-md-6">
            <div class="field-label">{{ field.title }}</div>
            <div
              class="field-value"
              :style="{
                color: fieldValues[name] ? '' : '#d8d8d8',
              }"
            >
              {{ fieldValues[name] || 'Нет данных' }}
            </div>
          </div>
        </div>
      </div>
      <!-- Компонент для отображения комментариев -->
      <CommentSection
        class="card-footer bg-transparent border-success"
        :commentFields="commentFields"
        :fieldValues="fieldValuesComputed"
      />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, reactive, watch } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiFormatListBulletedType } from '@mdi/js'
import { formatValue as formatterFormatValue } from '@/utils/formatters-2.js'
import CommentSection from './CardComment.vue'

export default defineComponent({
  components: { SvgIcon, CommentSection },
  props: {
    header: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const mdiFormatListBulletedTypeRef = ref(mdiFormatListBulletedType)

    // Подразделяем поля на основные и комментарии
    const commentFields = computed(() => {
      return Object.entries(props.header.fields || {})
        .filter(([name]) => name.includes('comments'))
        .map(([name, field]) => ({ name, ...field }))
    })

    const allFields = computed(() => {
      return Object.entries(props.header.fields || {})
        .filter(([name]) => !name.includes('comments'))
        .reduce((acc, [name, field]) => {
          acc[name] = field
          return acc
        }, {})
    })

    // Реактивный объект для хранения значений полей
    const fieldValues = reactive({})

    // Обновление fieldValues на основе props.header.data
    const updateFieldValues = () => {
      Object.assign(
        fieldValues,
        Object.fromEntries(
          Object.keys(props.header.fields || {}).map((name) => [
            name,
            formatterFormatValue(props.header.data?.[name] ?? null, name),
          ])
        )
      )
    }

    // Наблюдаем за изменениями в props.header и обновляем fieldValues
    watch(
      () => props.header,
      () => updateFieldValues(),
      { immediate: true }
    )

    // Комментарии обрабатываются отдельно
    const fieldValuesComputed = computed(() => fieldValues)

    return {
      mdiFormatListBulletedType: mdiFormatListBulletedTypeRef,
      allFields,
      commentFields,
      fieldValues,
      fieldValuesComputed,
    }
  },
})
</script>

<style scoped>
.field-label {
  font-size: 0.8rem;
  color: #212529;
  font-weight: 600;
}

.field-value {
  font-size: 1rem;
  color: #495057;
}
</style>
