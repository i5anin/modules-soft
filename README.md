# 📌 Модульный фронтенд универсальных таблиц  

[![wakatime](https://wakatime.com/badge/github/i5anin/modules-soft__pf-forum.svg)](https://wakatime.com/badge/github/i5anin/modules-soft__pf-forum)  

Гибкая система для работы с таблицами: динамическое построение, иерархическая структура в сборках, адаптивные компоненты.

---

## 📂 Структура проекта
```
📦 src
├── 📂 assets — ⭐ Статические файлы (изображения, иконки, шрифты)
│
├── 📂 entities
│   └── 📂 auth
│       └── 📜 authStore.js 
│
├── 📂 modules — ⭐ Функциональные модули системы
│   ├── 📂 _main
│   │   ├── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │   │   ├── 📗 AppBreadcrumbs.vue 
│   │   │   ├── 📗 AppHeader.vue 
│   │   │   └── 📗 AppMenu.vue 
│   │   │
│   │   └── 📂 store — ⭐ Глобальное хранилище данных (Pinia, Vuex)
│   │       └── 📜 store.js  — Хранилище данных (Pinia, Vuex)
│   │
│   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   ├── 📜 apiClient.js 
│   │   ├── 📜 authApi.js 
│   │   ├── 📜 authClient.js 
│   │   ├── 📜 responseHandlers.js 
│   │   └── 📜 tokenService.js 
│   │
│   ├── 📂 dev
│   │   ├── 📗 fieldsProcessor.vue 
│   │   └── 📗 fieldsWatch.vue 
│   │
│   ├── 📂 form-2-card-noms
│   │   └── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │       ├── 📗 CardComment.vue 
│   │       └── 📗 Form2CardNoms.vue 
│   │
│   ├── 📂 form-3-nom
│   │   ├── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │   │   ├── 📂 card
│   │   │   │   ├── 📗 EditableField.vue 
│   │   │   │   └── 📗 ReadonlyField.vue 
│   │   │   │
│   │   │   └── 📗 Form3Card.vue 
│   │   │
│   │   └── 📂 utils
│   │       └── 📜 calculateHeight.js 
│   │
│   ├── 📂 modal-tools
│   │   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   │   └── 📜 tools.js 
│   │   │
│   │   └── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │       ├── 📗 AddedInstrumentsTable.vue 
│   │       ├── 📗 PagesModalTools.vue 
│   │       └── 📗 ProposedInstrumentsTable.vue 
│   │
│   ├── 📂 shared
│   │   ├── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │   │   ├── 📂 common
│   │   │   │   └── 📗 WarningMessage.vue 
│   │   │   │
│   │   │   ├── 📂 forms
│   │   │   │   └── 📗 DateRangeFilters.vue 
│   │   │   │
│   │   │   ├── 📂 pagination
│   │   │   │   ├── 📗 PageSizeSelector.vue 
│   │   │   │   └── 📗 TablePagination.vue 
│   │   │   │
│   │   │   ├── 📂 search
│   │   │   │   └── 📗 SearchBar.vue 
│   │   │   │
│   │   │   └── 📂 ui
│   │   │       ├── 📗 BackButton.vue 
│   │   │       ├── 📗 LoadingSpinner.vue 
│   │   │       ├── 📗 StatusDisplay.vue 
│   │   │       ├── 📗 StrategyDisplay.vue 
│   │   │       └── 📗 ThinProgressBar.vue 
│   │   │
│   │   ├── 📂 logic
│   │   │   └── 📜 statuses.js 
│   │   │
│   │   ├── 📂 tables
│   │   │   ├── 📂 sborka
│   │   │   │   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   │   │   │   └── 📜 update.js 
│   │   │   │   │
│   │   │   │   ├── 📗 PendingUpdatesOverlay.vue 
│   │   │   │   ├── 📗 SborMain.vue 
│   │   │   │   ├── 📗 SborRow.vue 
│   │   │   │   └── 📜 tableStore.js 
│   │   │   │
│   │   │   ├── 📂 sborka-server
│   │   │   │   └── 📗 ServerSideSborka.vue 
│   │   │   │
│   │   │   ├── 📂 table
│   │   │   │   └── 📗 BaseTable.vue 
│   │   │   │
│   │   │   └── 📂 table-server
│   │   │       ├── 📗 DataTable.vue 
│   │   │       ├── 📗 EditModal.vue 
│   │   │       └── 📗 PaginatedDataTable.vue 
│   │   │
│   │   └── 📂 zagotovka
│   │       ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │       │   └── 📜 zagotovka.js 
│   │       │
│   │       └── 📗 ModalZagotovka.vue 
│   │
│   └── 📜 locales.js 
│
├── 📂 pages
│   ├── 📂 admin
│   │   ├── 📗 AdminHome.vue 
│   │   └── 📗 Structure.vue 
│   │
│   ├── 📂 auth
│   │   └── 📗 AuthLogin.vue 
│   │
│   ├── 📂 form-1
│   │   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   │   ├── 📜 clients.js 
│   │   │   └── 📜 list.js 
│   │   │
│   │   ├── 📗 PagesClients.vue 
│   │   └── 📗 PagesTableWrapper.vue 
│   │
│   ├── 📂 form-2
│   │   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   │   ├── 📜 nom_dir.js 
│   │   │   └── 📜 nom_list.js 
│   │   │
│   │   ├── 📗 PagesCardNoms.vue 
│   │   └── 📗 PagesClientNoms.vue 
│   │
│   └── 📂 form-3
│       ├── 📂 api — ⭐ Модули взаимодействия с сервером
│       │   └── 📜 nom_info.js 
│       │
│       └── 📗 PagesDetailNom.vue 
│
├── 📂 store — ⭐ Глобальное хранилище данных (Pinia, Vuex)
│   └── 📜 home.module.js 
│
├── 📂 utils
│   ├── 📂 dev
│   │   └── 📜 fieldsProcessor.js 
│   │
│   ├── 📜 formatters.js 
│   ├── 📜 icons.js 
│   └── 📜 localize-ru.js 
│
├── 📗 App.vue 
├── 📜 main.js  — Главный файл инициализации Vue-приложения
└── 📜 router.js  — Конфигурация маршрутизации Vue
```

---

## 📊 Статистика проекта

- 📄 **Всего файлов**: 67
- 📜 **Всего строк кода**: 5408


### 📁 Количество файлов и строк (`src`):
  - .js: 26 файлов, 1110 строк
  - .vue: 41 файлов, 4298 строк

### 📊 Топ-5 длинных файлов (`src`):
- 🔍 formatters.js — 211 строк
- 🔍 router.js — 197 строк
- 🔍 fieldsWatch.vue — 178 строк
- 🔍 SborRow.vue — 168 строк
- 🔍 DataTable.vue — 166 строк


