<template>
  <div v-if="header" class="card mb-2">
    <div class="p-3 d-flex align-items-center header-icons">
      <svg-icon
        type="mdi"
        :path="mdiFormatListBulletedType"
        class="section-title"
      />
      <strong class="section-title">Информация о заказе</strong>
    </div>

    <div
      v-for="(field, name) in allFields"
      :key="name"
      :title="`${field?.type}&#10;${name || ''}`"
      class="row gx-0 border-bottom"
    >
      <div
        class="col-6 d-flex align-items-center py-1 px-2 text-start field-label"
      >
        {{ field.title }}
      </div>
      <div
        :class="[
          'col-6',
          'd-flex',
          'align-items-center',
          'justify-content-end',
          'py-1',
          'px-2',
          'field-value',
        ]"
        :style="{ color: fieldValues[name] ? '' : '#ff4f4f' }"
      >
        {{ fieldValues[name] || '-' }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, reactive, watch } from 'vue'
  import SvgIcon from '@jamescoyle/vue-icon'
  import { mdiFormatListBulletedType } from '@mdi/js'
  import { formatValue } from '@/shared/lib/formatters.js'
  import { processFields } from '@/shared/lib/dev/applyFieldPermissions.js'

  const props = defineProps({
    header: {
      type: Object,
      required: true,
    },
  })

  const allFields = computed(() => {
    const fields = props.header.fields || {}
    const fieldsArray = Object.entries(fields).map(([key, value]) => ({
      key,
      ...value,
    }))
    const processedFields = processFields(fieldsArray)

    return processedFields
      .filter((field) => field.permissions?.read)
      .reduce((acc, field) => {
        acc[field.key] = field
        return acc
      }, {})
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
</script>

<style scoped>
  /* Заголовок секции */
  .section-title {
    color: #9cdcff;
    font-size: 0.8rem;
    font-weight: 600;
  }

  /* Лейбл в строке данных */
  .field-label {
    color: #9cdcff;
    font-size: 0.8rem;
    font-weight: 600;
    word-break: break-word;
  }

  /* Значение в строке данных */
  .field-value {
    font-size: 0.75rem;
    word-break: break-word;
  }

  /* Заголовочная иконка + текст */
  .header-icons {
    gap: 0.28rem;
    flex-wrap: wrap;
  }
</style>
