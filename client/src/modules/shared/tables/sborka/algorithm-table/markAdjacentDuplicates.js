import { dataSets } from './data.js' // Импорт данных

// Функция для генерации заголовков (A, B, C, ...)
function generateColumnHeaders(length) {
  return ['#', ...Array.from({ length }, (_, i) => String.fromCharCode(65 + i))]
}

// Функция для пометки повторов только среди соседних строк с ID
function markAdjacentDuplicatesWithId(dataSets) {
  const rowCount = dataSets.length
  const colCount = dataSets[0].length
  const markedData = JSON.parse(JSON.stringify(dataSets)) // Копируем данные

  // Объект для хранения первого появления значения (ID)
  const valueToId = new Map()
  let nextId = 1 // Начальный ID

  for (let col = 0; col < colCount; col++) {
    for (let row = 1; row < rowCount; row++) {
      let currentValue = dataSets[row][col]
      let prevValue = dataSets[row - 1][col]

      if (currentValue === prevValue) {
        // Если значение уже есть в мапе, используем его ID
        if (valueToId.has(currentValue)) {
          let existingId = valueToId.get(currentValue)
          markedData[row - 1][col] = `${prevValue}*${existingId}`
          markedData[row][col] = `${currentValue}*${existingId}`
        } else {
          // Назначаем новое ID и помечаем обе строки
          valueToId.set(currentValue, nextId)
          markedData[row - 1][col] = `${prevValue}*${nextId}`
          markedData[row][col] = `${currentValue}*${nextId}`
          nextId++ // Увеличиваем ID
        }
      }
    }
  }

  return markedData
}

// Обрабатываем данные
const markedData = markAdjacentDuplicatesWithId(dataSets)

// Генерируем заголовки колонок
const headers = generateColumnHeaders(markedData[0].length)

// Выводим заголовки
console.log(headers.join('\t'))

// Выводим строки с нумерацией
markedData.forEach((row, index) => {
  console.log([index + 1, ...row].join('\t'))
})
