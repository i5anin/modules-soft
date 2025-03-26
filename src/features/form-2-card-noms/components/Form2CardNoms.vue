<template>
  <div v-if="header" class="card mb-2">
    <div class="p-3 d-flex align-items-center gap-2">
      <svg-icon
        type="mdi"
        :path="mdiFormatListBulletedType"
        class="color-red"
      />
      <strong>Информация о заказе</strong>
    </div>

    <div class="card-body p-0">
      <table class="table table-sm w-100 mb-0">
        <tbody>
          <tr
            v-for="(field, name) in allFields"
            :key="name"
            :title="`${field?.type}&#10;${name || ''}`"
          >
            <th class="color-red align-middle font-size ps-2">
              {{ field.title }}
            </th>
            <td
              class="text-end align-middle pe-2 font-size-min"
              :style="{ color: fieldValues[name] ? '' : '#d8d8d8' }"
            >
              {{ fieldValues[name] || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { computed, reactive, watch } from 'vue'
  import SvgIcon from '@jamescoyle/vue-icon'
  import { mdiFormatListBulletedType } from '@mdi/js'
  import { formatValue } from '@/utils/formatters.js'
  import { processFields } from '@/utils/dev/fieldsProcessor.js'

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
  .color-red {
    color: #9cdcff;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .font-size {
    font-size: 10px;
  }

  .font-size-min {
    font-size: 12px;
  }

  .d-flex {
    gap: 0.28rem;
    flex-wrap: wrap;
  }
</style>
