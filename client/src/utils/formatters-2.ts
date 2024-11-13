import moment from 'moment'

export function formatValue(value, type) {
  switch (type) {
    case 'bool':
      return formatBoolean(value)
    case 'integer':
    case 'float':
      return formatNumber(value)
    case 'string':
      return formatText(value)
    case 'date':
      return formatDate(value)
    case 'timestamp':
      return formatTimestamp(value)
    case 'NULL':
      return ''
    default:
      return value || ''
  }
}

function formatBoolean(value) {
  return value ? '✅' : ''
}

function formatNumber(value) {
  // Преобразуем строковое представление числа, если это строка
  const numberValue = typeof value === 'string' ? parseFloat(value) : value

  if (numberValue !== null && !isNaN(numberValue)) {
    // Проверяем, есть ли у числа дробная часть
    return Number.isInteger(numberValue)
      ? numberValue.toLocaleString('ru-RU')
      : numberValue.toFixed(2).toLocaleString('ru-RU')
  }

  return ''
}

function formatText(value) {
  if (typeof value === 'number') {
    return formatNumber(value) // Возвращаем отформатированное значение, если это число
  } else {
    return value || ''
  }
}

function formatDate(value) {
  return value ? moment(value).format('DD.MM.YYYY') : ''
}

function formatTimestamp(value) {
  return value ? moment(value).format('DD.MM.YYYY HH:mm') : ''
}
