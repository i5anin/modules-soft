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
  const numberValue = typeof value === 'string' ? parseFloat(value) : value

  if (numberValue !== null && !isNaN(numberValue)) {
    return Number.isInteger(numberValue)
      ? numberValue.toLocaleString('ru-RU')
      : numberValue.toFixed(2).toLocaleString('ru-RU')
  }

  return ''
}

function formatText(value) {
  if (typeof value === 'number') {
    return formatNumber(value)
  } else if (typeof value === 'string' && isEmail(value)) {
    return `<a href="mailto:${value}">${value}</a>`
  } else {
    return value || ''
  }
}

function isEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

function formatDate(value) {
  return value ? moment(value).format('DD.MM.YYYY') : ''
}

function formatTimestamp(value) {
  return value ? moment(value).format('DD.MM.YYYY HH:mm') : ''
}
