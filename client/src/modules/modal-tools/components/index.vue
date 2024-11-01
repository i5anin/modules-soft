<template>
  <div
    class="modal fade"
    id="orderModal"
    tabindex="-1"
    aria-labelledby="orderModalLabel"
    aria-hidden="true"
    ref="modalContainer"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderModalLabel">
            Инструмент (операция {{ no }}, уникальный id операции {{ nomId }})
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="instrumentData">
            <!-- Временная таблица добавленного инструмента -->
            <div v-if="addedInstruments.length > 0">
              <h5>Добавленные инструменты:</h5>
              <table
                class="table table-sm table-bordered table-hover table-striped mt-3"
              >
                <thead>
                  <tr class="text-center">
                    <th style="width: 1%">#</th>
                    <th style="width: 1%">Т шт.</th>
                    <th style="width: 20%">
                      Расположение в дереве инструмента
                    </th>
                    <th style="width: 20%">Характеристики</th>
                    <th style="width: 1%">Удалить</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in addedInstruments"
                    :key="'added-' + index"
                  >
                    <td class="text-center align-middle">{{ index + 1 }}</td>
                    <td class="text-center align-middle">{{ item.t_op }}</td>
                    <td>
                      <ul class="list-group list-group-flush">
                        <li
                          class="list-group-item"
                          v-for="(segment, segmentIndex) in item.path.split(
                            ' > '
                          )"
                          :key="segmentIndex"
                        >
                          {{ segment }}
                        </li>
                      </ul>
                    </td>
                    <td>
                      <ul
                        class="list-group list-group-flush list-group-item-success"
                      >
                        <li
                          class="list-group-item"
                          v-for="(value, key) in item.property_description"
                          :key="key"
                        >
                          {{ key }}: <b>{{ value }}</b>
                        </li>
                      </ul>
                    </td>
                    <td class="text-center align-middle">
                      <button
                        type="button"
                        class="btn btn-circle"
                        @click="removeInstrument(index)"
                      >
                        <svg-icon type="mdi" :path="mdiDelete" color="red" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Исходная таблица инструментов -->
            <h5>Предложенный инструмент:</h5>
            <table
              class="table table-sm table-bordered table-hover table-striped mt-4"
            >
              <thead>
                <tr class="text-center">
                  <th style="width: 1%">#</th>
                  <th style="width: 1%">Т шт.</th>
                  <th style="width: 30%">Комментарии оператора</th>
                  <th style="width: 20%">Расположение в дереве инструмента</th>
                  <th style="width: 20%">Характеристики</th>
                  <th style="width: 1%">Добавить</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in instrumentData.data.slice(0, 5)"
                  :key="index"
                >
                  <td class="text-center align-middle">{{ index + 1 }}</td>
                  <td class="text-center align-middle">{{ item.t_op }}</td>
                  <td>
                    <ul class="list-group list-group-flush mt-2">
                      <!-- Показываем первые три комментария по умолчанию -->
                      <li
                        class="list-group-item"
                        v-for="(
                          comment, cIndex
                        ) in item.comments_operators.slice(0, 3)"
                        :key="cIndex"
                        style="font-size: 13px"
                      >
                        {{ comment }}
                      </li>
                    </ul>

                    <!-- Кнопка для раскрытия оставшихся комментариев, отображаемая под списком -->
                    <div
                      v-if="item.comments_operators.length > 3"
                      class="text-center mt-2"
                    >
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        type="button"
                        data-bs-toggle="collapse"
                        :data-bs-target="'#collapseComments' + index"
                        aria-expanded="false"
                        :aria-controls="'collapseComments' + index"
                        style="font-size: 12px"
                      >
                        Показать остальные
                      </button>
                      <div
                        :id="'collapseComments' + index"
                        class="collapse mt-2"
                      >
                        <ul class="list-group list-group-flush">
                          <li
                            class="list-group-item"
                            v-for="(
                              comment, subIndex
                            ) in item.comments_operators.slice(3)"
                            :key="subIndex"
                            style="font-size: 13px"
                          >
                            {{ comment }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>

                  <td>
                    <ul class="list-group list-group-flush">
                      <li
                        class="list-group-item"
                        v-for="(segment, segmentIndex) in item.path.split(
                          ' > '
                        )"
                        :key="segmentIndex"
                      >
                        {{ segment }}
                      </li>
                    </ul>
                  </td>
                  <td>
                    <ul
                      class="list-group list-group-flush list-group-item-warning"
                    >
                      <li
                        class="list-group-item"
                        v-for="(value, key) in item.property_description"
                        :key="key"
                      >
                        {{ key }}: <b>{{ value }}</b>
                      </li>
                    </ul>
                  </td>
                  <td class="text-center align-middle">
                    <button
                      type="button"
                      class="btn btn-circle"
                      @click="addInstrument(item)"
                    >
                      <svg-icon
                        type="mdi"
                        :path="mdiPlusCircle"
                        color="green"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p>Загрузка данных...</p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="closeModal"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'
import { fetchInstrumentData } from '../api/tools.js'
import { useRoute } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlusCircle, mdiDelete } from '@mdi/js'

const route = useRoute()

const no = ref(route.params.no)
const nomId = ref(route.params.nomId)
const emit = defineEmits(['close'])

const modalContainer = ref(null)
let modalInstance = null
const instrumentData = ref(null)
const addedInstruments = ref([]) // Массив для хранения добавленных инструментов

onMounted(() => {
  modalInstance = new Modal(modalContainer.value)
  fetchData()
})

const fetchData = async () => {
  if (no.value && nomId.value) {
    try {
      instrumentData.value = await fetchInstrumentData(no.value, nomId.value)
      modalInstance.show()
    } catch (error) {
      console.error('Ошибка при загрузке данных инструмента:', error)
      instrumentData.value = null
    }
  }
}

// Функция для добавления инструмента в временную таблицу
const addInstrument = (item) => {
  addedInstruments.value.push(item)
}

// Функция для удаления инструмента из временной таблицы
const removeInstrument = (index) => {
  addedInstruments.value.splice(index, 1)
}

// Функция для закрытия модального окна
const closeModal = () => {
  emit('close')
  modalInstance.hide()
}
</script>

<style scoped>
.table {
  width: 100%;
  margin: 20px 0;
}

.table th {
  text-align: center; /* Центрируем текст в заголовках таблицы */
}

.btn-circle {
  background-color: transparent;
  border: none;
}

.btn-circle:hover {
  background-color: transparent;
}
</style>
