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
          <div v-for="field in allFields" :key="field.name" class="col-md-6">
            <div class="field-label">{{ field.title }}</div>
            <div
              class="field-value"
              :style="{
                color: fieldValues[field.name] ? '' : '#d8d8d8',
              }"
            >
              {{ fieldValues[field.name] || 'Нет данных' }}
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
import { formatValue as formatterFormatValue } from '@/utils/formatters.js'
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

    const commentFields = computed(() =>
      props.header.fields
        ? props.header.fields.filter((field) => field.name.includes('comments'))
        : []
    )

    const allFields = computed(() =>
      props.header.fields
        ? props.header.fields.filter(
            (field) => !field.name.includes('comments')
          )
        : []
    )

    const fieldValues = reactive({})

    const updateFieldValues = () => {
      Object.assign(
        fieldValues,
        Object.fromEntries(
          [...allFields.value, ...commentFields.value].map((field) => [
            field.name,
            formatterFormatValue(props.header.data[field.name], field.name),
          ])
        )
      )
    }

    watch(
      () => props.header,
      () => updateFieldValues(),
      { immediate: true }
    )

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
