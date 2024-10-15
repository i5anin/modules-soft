import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faCalendarDays, faXmark, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'; // Используем solid версию иконок
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

// Добавляем необходимые иконки в библиотеку
library.add(faXmark, faCalendarDays, faPlus, faMinus, faCalendar);

export { FontAwesomeIcon };
