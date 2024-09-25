// src/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faXmark, faCalendarDays, faCalendar);

export { FontAwesomeIcon };