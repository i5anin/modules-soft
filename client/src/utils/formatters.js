import moment from 'moment'
import 'moment/locale/ru'

moment.locale('ru')

export function formatValueCard(value, fieldName) {
  if (fieldName.toLowerCase().includes('price')) {
    return formatPrice(value)
  }
  if (fieldName.toLowerCase().includes('date')) {
    return formatDate(value)
  }
  if (fieldName.toLowerCase().includes('time')) {
    return formatTime(value)
  }
  return value
}

export function formatValue(value, fieldName) {
  if (typeof value === 'boolean' && fieldName !== 'goz') {
    return formatBoolean(value)
  }
  if (fieldName.toLowerCase().includes('price')) {
    return formatPrice(value)
  }
  if (fieldName.toLowerCase().includes('date')) {
    return formatDate(value)
  }
  if (fieldName.toLowerCase().includes('time')) {
    return formatTime(value)
  }
  return value
}

export function formatDate(dateString) {
  return moment(dateString).format('DD.MM.YYYY')
}

export function formatTime(dateString) {
  const days = parseInt(dateString, 10)
  return days === 0 ? '' : `${days} дней`
}

export function formatPrice(price) {
  const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(price)
}

export function formatBoolean(value) {
  if (typeof value === 'boolean') {
    return value ? '✅' : ''
  }
  return value
}

// Экспортируем объект formatters по умолчанию
export default {
  formatValue,
  formatTime,
  formatDate,
  formatPrice,
  formatBoolean,
}
