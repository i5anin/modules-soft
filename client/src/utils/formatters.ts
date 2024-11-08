

// Удаляем все console.log из formatters.ts
import moment from 'moment'
import 'moment/locale/ru'

moment.locale('ru')

export function formatValue(value, type) {
  console.log(value, type)
  switch (type) {
    case 'boolean':
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
      return '' // Обработка пустого значения
    default:
      return value || ''
  }
}

function formatBoolean(value) {
  return value ? '✅' : ''
}

function formatNumber(value) {
  return value !== null ? value.toLocaleString('ru-RU') : ''
}

function formatText(value) {
  return value || ''
}

function formatDate(value) {
  return value ? moment(value).format('DD.MM.YYYY') : ''
}

function formatTimestamp(value) {
  return value ? moment(value).format('DD.MM.YYYY HH:mm') : ''
}

export default { formatValue }
