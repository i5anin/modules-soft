<template>
  <div v-if="header" class="card mb-2">
    <div class="p-3">
      <svg-icon
        type="mdi"
        :path="mdiFormatListBulletedType"
        class="color-red"
      />
      Информация о заказе
    </div>
    <div class="card-body row">
      <div
        v-for="(field, name) in allFields"
        :key="name"
        class="col-md-6"
        :title="`${field?.type}&#10;${name || ''}`"
      >
        <div class="field-label">{{ field.title }}</div>
        <div
          class="field-value"
          :style="{ color: fieldValues[name] ? '' : '#d8d8d8' }"
        >
          {{ fieldValues[name] || '-' }}
        </div>
      </div>
    </div>
    <CommentSection
      :comment-fields="commentFields"
      :field-values="fieldValuesComputed"
    />
  </div>
</template>

<script>
  import { computed, defineComponent, reactive, watch } from 'vue'
  import SvgIcon from '@jamescoyle/vue-icon'
  import { mdiFormatListBulletedType } from '@mdi/js'
  import { formatValue } from '@/utils/formatters.js'
  import CommentSection from './CardComment.vue'
  import { processFields } from '@/utils/dev/fieldsProcessor.js'

  export default defineComponent({
    components: { SvgIcon, CommentSection },
    props: {
      header: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const allFields = computed(() => {
        const fields = props.header.fields || {}
        const fieldsArray = Object.entries(fields).map(([key, value]) => ({
          key,
          ...value,
        }))
        const processedFields = processFields(fieldsArray)

        return processedFields
          .filter((field) => field.permissions?.read) // Фильтруем только видимые поля
          .reduce((acc, field) => {
            acc[field.key] = field
            return acc
          }, {})
      })

      const commentFields = computed(() => {
        return Object.entries(props.header.fields || {})
          .filter(([name]) => name.includes('comments'))
          .map(([name, field]) => ({ name, ...field }))
      })

      const fieldValues = reactive({})

      const updateFieldValues = () => {
        Object.assign(
          fieldValues,
          Object.fromEntries(
            Object.keys(props.header.fields || {}).map((name) => [
              name,
              formatValue(
                props.header.data?.[name] ?? null,
                props.header.fields[name]?.type || '',
                name
              ),
            ])
          )
        )
      }

      watch(() => props.header, updateFieldValues, { immediate: true })

      return {
        mdiFormatListBulletedType,
        allFields,
        commentFields,
        fieldValues,
        fieldValuesComputed: computed(() => fieldValues),
      }
    },
  })
</script>

<style scoped>
  .color-red {
    color: #ff6868;
  }

  .field-label {
    font-size: 0.8rem;
    color: #ff6868;
    font-weight: 600;
  }

  .field-value {
    font-size: 1rem;
    //color: #68ffd2;
  }
</style>
