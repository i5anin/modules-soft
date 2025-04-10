# 📌 Модульный фронтенд универсальных таблиц  

[![wakatime](https://wakatime.com/badge/github/i5anin/modules-soft__pf-forum.svg)](https://wakatime.com/badge/github/i5anin/modules-soft__pf-forum)  

Гибкая система для работы с таблицами: динамическое построение, иерархическая структура в сборках, адаптивные компоненты.

---

## 📂 Структура проекта
```
📦 src
├── 📂 app
│
├── 📂 assets — ⭐ Статические файлы (изображения, иконки, шрифты)
│
├── 📂 entities
│   ├── 📂 auth
│   │   └── 📜 authStore.js 
│   │
│   ├── 📂 table
│   │
│   └── 📂 user
│
├── 📂 features
│   ├── 📂 form-2-card-noms
│   │   └── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │       └── 📗 Form2CardNoms.vue 
│   │
│   └── 📂 form-3-nom
│       ├── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│       │   ├── 📂 card
│       │   │   ├── 📗 EditableField.vue 
│       │   │   └── 📗 ReadonlyField.vue 
│       │   │
│       │   └── 📗 Form3Card.vue 
│       │
│       └── 📂 utils
│           └── 📜 calculateHeight.js 
│
├── 📂 modules — ⭐ Функциональные модули системы
│   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   ├── 📜 apiClient.js 
│   │   ├── 📜 authApi.js 
│   │   ├── 📜 authClient.js 
│   │   ├── 📜 responseHandlers.js 
│   │   └── 📜 tokenService.js 
│   │
│   ├── 📂 dev
│   │   └── 📗 RouteExplorer.vue 
│   │
│   └── 📂 main
│       ├── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│       │   ├── 📗 AppBreadcrumbs.vue 
│       │   ├── 📗 AppHeader.vue 
│       │   └── 📗 AppMenu.vue 
│       │
│       └── 📂 store — ⭐ Глобальное хранилище данных (Pinia, Vuex)
│           └── 📜 store.js  — Хранилище данных (Pinia, Vuex)
│
├── 📂 pages
│   ├── 📂 auth
│   │   └── 📗 PagesLogin.vue 
│   │
│   ├── 📂 form-1
│   │   ├── 📗 PagesClients.vue 
│   │   └── 📗 PagesTableWrapper.vue 
│   │
│   ├── 📂 form-2
│   │   ├── 📗 PagesCardNoms.vue 
│   │   └── 📗 PagesClientNoms.vue 
│   │
│   └── 📂 form-3
│       └── 📗 PagesDetailNom.vue 
│
├── 📂 shared
│   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   ├── 📜 clients.js 
│   │   ├── 📜 list.js 
│   │   ├── 📜 nom_dir.js 
│   │   ├── 📜 nom_info.js 
│   │   ├── 📜 nom_list.js 
│   │   ├── 📜 nomListApi.test.js 
│   │   ├── 📜 update.js 
│   │   └── 📜 zagotovka.js 
│   │
│   ├── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │   ├── 📂 forms
│   │   │   └── 📗 DateRangeFilters.vue 
│   │   │
│   │   ├── 📂 pagination
│   │   │   ├── 📗 PageSizeSelector.vue 
│   │   │   └── 📗 TablePagination.vue 
│   │   │
│   │   ├── 📂 search
│   │   │   └── 📗 SearchBar.vue 
│   │   │
│   │   └── 📂 ui
│   │       ├── 📗 LoadingSpinner.vue 
│   │       ├── 📗 StatusDisplay.vue 
│   │       ├── 📗 StrategyDisplay.vue 
│   │       └── 📗 ThinProgressBar.vue 
│   │
│   ├── 📂 logic
│   │   └── 📜 statuses.js 
│   │
│   ├── 📂 tables
│   │   ├── 📂 sborka
│   │   │   ├── 📗 PendingUpdatesOverlay.vue 
│   │   │   ├── 📗 SborMain.vue 
│   │   │   └── 📗 SborRow.vue 
│   │   │
│   │   ├── 📂 sborka-server
│   │   │   └── 📗 ServerSideSborka.vue 
│   │   │
│   │   ├── 📂 table
│   │   │   └── 📗 BaseTable.vue 
│   │   │
│   │   └── 📂 table-server
│   │       ├── 📗 DataTable.vue 
│   │       ├── 📗 EditModal.vue 
│   │       └── 📗 PaginatedDataTable.vue 
│   │
│   └── 📂 zagotovka
│       └── 📗 ModalZagotovka.vue 
│
├── 📂 utils
│   ├── 📂 dev
│   │   └── 📜 applyFieldPermissions.js 
│   │
│   ├── 📜 formatters.js 
│   ├── 📜 icons.js 
│   └── 📜 localize-ru.js 
│
├── 📂 widgets
│   └── 📂 modal-tools
│       ├── 📂 api — ⭐ Модули взаимодействия с сервером
│       │   └── 📜 tools.js 
│       │
│       └── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│           ├── 📗 AddedInstrumentsTable.vue 
│           ├── 📗 PagesModalTools.vue 
│           └── 📗 ProposedInstrumentsTable.vue 
│
├── 📗 App.vue 
├── 📜 main.js  — Главный файл инициализации Vue-приложения
└── 📜 router.js  — Конфигурация маршрутизации Vue
```

---

## 📊 Статистика проекта

- 📄 **Всего файлов**: 59
- 📜 **Всего строк кода**: 4963


### 📁 Количество файлов и строк (`src`):
  - .js: 24 файлов, 1075 строк
  - .vue: 35 файлов, 3888 строк

### 📊 Топ-5 длинных файлов (`src`):
- 🔍 SborRow.vue — 228 строк
- 🔍 formatters.js — 211 строк
- 🔍 router.js — 193 строк
- 🔍 DataTable.vue — 166 строк
- 🔍 PagesModalTools.vue — 158 строк


