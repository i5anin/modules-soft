import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faCalendarDays,
  faXmark,
  faPlus,
  faMinus,
  faCubes,
  faCube,
  faCircle,
} from '@fortawesome/free-solid-svg-icons' // Добавляем нужные иконки
import { faCalendar } from '@fortawesome/free-regular-svg-icons'

// Добавляем необходимые иконки в библиотеку
library.add(
  faXmark,
  faCalendarDays,
  faPlus,
  faMinus,
  faCubes,
  faCube,
  faCalendar,
  faCircle
)

export { FontAwesomeIcon }
