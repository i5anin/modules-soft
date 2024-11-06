import moment from 'moment'
import 'moment/locale/ru'

moment.locale('ru')

export function formatValueCard(
  value: string | number | boolean | null,
  fieldName: string
): string | number {
  const field = fieldName.toLowerCase()
  if (field.includes('price')) return formatPrice(value)
  if (field.includes('date') && typeof value === 'string')
    return formatDate(value)
  if (field.includes('time')) return formatTime(value)

  return value ?? ''
}

export function formatValue(
  value: string | number | boolean | null,
  fieldName: string
): string | number {
  if (typeof value === 'boolean' && fieldName !== 'goz')
    return formatBoolean(value)
  if (fieldName.toLowerCase().includes('price'))
    return formatPrice(value as number)
  if (fieldName.toLowerCase().includes('date'))
    return formatDate(value as string)
  if (fieldName.toLowerCase().includes('time'))
    return formatTime(value as string)
  return value || ''
}

export function formatDate(dateString: string): string {
  return moment(dateString).format('DD.MM.YYYY')
}

export function formatTime(dateString: string | number): string {
  const days =
    typeof dateString === 'string' ? parseInt(dateString, 10) : dateString
  return days === 0 ? '' : `${days} дней`
}

export function formatPrice(price: number | string): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(numericPrice)
}

export function formatBoolean(value: boolean): string {
  return value ? '✅' : ''
}

// Экспортируем объект formatters по умолчанию
const formatters = {
  formatValue,
  formatValueCard,
  formatTime,
  formatDate,
  formatPrice,
  formatBoolean,
}

export default formatters
