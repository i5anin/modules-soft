import { Locale, ru } from 'date-fns/locale'

const customRuLocale: Locale = {
  ...ru,
  localize: {
    ...ru.localize,
    day: (day: number): string => {
      const days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
      return days[day]
    },
  },
}

export default customRuLocale
