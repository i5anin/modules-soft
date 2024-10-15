import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faCalendarDays, faXmark } from '@fortawesome/free-solid-svg-icons'; // "solid"
import { faCirclePlus, faCircleMinus, faCalendar } from '@fortawesome/free-regular-svg-icons'; // "regular"


library.add(faXmark, faCalendarDays, faSquareMinus, faSquarePlus, faCalendar); // Добавляем обе версии иконок

export { FontAwesomeIcon };
