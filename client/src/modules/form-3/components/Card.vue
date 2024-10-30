<template>
  <div class="card mb-2">
    <div class="card-body p-2">
      <div class="row">
        <div class="col-md-6">
          <table class="table table-sm border-light">
            <tbody>
              <tr v-for="field in leftColumnFields" :key="field.name">
                <td class="p-1">{{ field.title }}</td>
                <td class="p-1" width="40%">
                  <textarea
                    v-if="String(fieldValues[field.name]).length >= 25"
                    v-model="fieldValues[field.name]"
                    :placeholder="field.title"
                    class="form-control form-control-sm"
                    disabled
                  />
                  <input
                    v-else
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

        <div class="col-md-6">
          <table class="table table-sm border-light">
            <tbody>
              <tr v-for="field in rightColumnFields" :key="field.name">
                <td class="p-1" width="50%">{{ field.title }}</td>
                <td class="p-1">
                  <textarea
                    v-if="String(fieldValues[field.name]).length >= 25"
                    v-model="fieldValues[field.name]"
                    :placeholder="field.title"
                    class="form-control form-control-sm"
                    disabled
                  />
                  <input
                    v-else
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
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  leftColumnFields: Array,
  rightColumnFields: Array,
  fieldValues: Object,
})
</script>
