<template>
  <div class="card mt-2">
    <!--    <div v-if="hasNonEmptyComments" class="card mt-2">-->
    <div class="card-body p-2">
      <table class="table table-sm">
        <tbody>
          <tr v-for="commentField in commentFields" :key="commentField.name">
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
                style="
                  width: 200%;
                  max-width: 100%;
                  height: 1rem;
                  resize: horizontal;
                "
                disabled
              ></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    commentFields: {
      type: Array,
      required: true,
    },
    fieldValues: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const hasNonEmptyComments = computed(() =>
      props.commentFields.some(
        (field) =>
          props.fieldValues[field.name] &&
          props.fieldValues[field.name].trim() !== ''
      )
    )

    return {
      hasNonEmptyComments,
    }
  },
})
</script>
