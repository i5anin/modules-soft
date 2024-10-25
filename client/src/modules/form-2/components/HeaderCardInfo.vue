<template>
  <div>
    <div v-if="header" class="card mb-2">
      <div class="card-header p-2">
        <span class="mdi mdi-format-list-bulleted-type"></span>
        <svg-icon type="mdi" :path="mdiFormatListBulletedType" color="red" />
        Информация о заказе
      </div>
      <div class="card-body p-2">
        <div class="row">
          <!-- Левая колонка -->
          <div class="col-md-6">
            <table class="table table-sm">
              <tbody>
                <tr v-for="field in leftFields" :key="field.name">
                  <td class="p-1">
                    <strong>{{ field.title }}</strong>
                  </td>
                  <td class="p-1">
                    <input
                      type="text"
                      v-model="fieldValues[field.name]"
                      :placeholder="field.title"
                      class="form-control form-control-sm"
                      disabled
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Правая колонка -->
          <div class="col-md-6">
            <table class="table table-sm">
              <tbody>
                <tr v-for="field in rightFields" :key="field.name">
                  <td class="p-1">
                    <strong>{{ field.title }}</strong>
                  </td>
                  <td class="p-1">
                    <input
                      aria-label="Small"
                      type="text"
                      v-model="fieldValues[field.name]"
                      :placeholder="field.title"
                      class="form-control form-control-sm"
                      disabled
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Комментарии, если они есть -->
        <div v-if="hasNonEmptyComments" class="card mt-2">
          <div class="card-body p-2">
            <table class="table table-sm">
              <tbody>
                <tr
                  v-for="commentField in commentFields"
                  :key="commentField.name"
                >
                  <td>
                    <strong>{{ commentField.title }}</strong>
                  </td>
                  <td>
                    <textarea
                      class="form-control"
                      aria-label="textarea"
                      type="text"
                      v-model="fieldValues[commentField.name]"
                      :placeholder="commentField.title"
                      disabled
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, reactive } from 'vue'
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

    const hasNonEmptyComments = computed(() =>
      commentFields.value.some(
        (field) =>
          props.header.data[field.name] &&
          props.header.data[field.name].trim() !== ''
      )
    )

    // Состояние для значений полей
    const fieldValues = reactive(
      Object.fromEntries(
        [...nonCommentFields.value, ...commentFields.value].map((field) => [
          field.name,
          formatterFormatValue(props.header.data[field.name], field.name),
        ])
      )
    )

    return {
      mdiFormatListBulletedType: mdiFormatListBulletedTypeRef,
      leftFields,
      rightFields,
      hasNonEmptyComments,
      commentFields,
      fieldValues,
    }
  },
})
</script>

<style scoped>
/* Ваши стили */
</style>
