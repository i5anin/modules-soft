<template>
  <div>
    <div v-if="header" class="card mb-3">
      <div class="card-header">
        <!-- Иконка mdi-format-list-bulleted-type через <span> -->
        <span class="mdi mdi-format-list-bulleted-type"></span>

        <!-- Иконка через компонент SvgIcon -->
        <svg-icon type="mdi" :path="mdiFormatListBulletedType" color="red" />

        Информация о заказе
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <p v-for="field in leftFields" :key="field.name" class="card-text">
              <strong>{{ field.title }}:</strong>
              {{ formatValue(header.data[field.name], field.name) }}
            </p>
          </div>
          <div class="col-md-6">
            <p v-for="field in rightFields" :key="field.name" class="card-text">
              <strong>{{ field.title }}:</strong>
              {{ formatValue(header.data[field.name], field.name) }}
            </p>
          </div>
        </div>
        <div v-if="hasNonEmptyComments" class="card mt-3">
          <div class="card-body">
            <template
              v-for="commentField in commentFields"
              :key="commentField.name"
            >
              <p v-if="header.data[commentField.name]" class="card-text">
                <span>
                  <strong>{{ commentField.title }}:</strong>
                  {{ header.data[commentField.name] }}
                </span>
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiFormatListBulletedType } from '@mdi/js'
import { formatValue as formatterFormatValue } from '@/utils/formatters.js'

export default defineComponent({
  components: { SvgIcon },
  props: {
    header: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const mdiFormatListBulletedTypeRef = ref(mdiFormatListBulletedType)

    const hasNonEmptyComments = computed(() =>
      commentFields.value.some(
        (field) =>
          props.header.data[field.name] &&
          props.header.data[field.name].trim() !== ''
      )
    )

    const commentFields = computed(() =>
      props.header.fields
        ? props.header.fields.filter((field) => field.name.includes('comments'))
        : []
    )

    const nonCommentFields = computed(() =>
      props.header.fields
        ? props.header.fields.filter(
            (field) => !field.name.includes('comments')
          )
        : []
    )

    const leftFields = computed(() =>
      nonCommentFields.value.slice(
        0,
        Math.ceil(nonCommentFields.value.length / 2)
      )
    )

    const rightFields = computed(() =>
      nonCommentFields.value.slice(Math.ceil(nonCommentFields.value.length / 2))
    )

    // Определение функции formatValue в setup
    const formatValue = (value, fieldName) => {
      return formatterFormatValue(value, fieldName)
    }

    return {
      mdiFormatListBulletedType: mdiFormatListBulletedTypeRef,
      hasNonEmptyComments,
      commentFields,
      nonCommentFields,
      leftFields,
      rightFields,
      formatValue,
    }
  },
})
</script>
