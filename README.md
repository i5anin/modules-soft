# 📌 Модульный фронтенд универсальных таблиц  

[![wakatime](https://wakatime.com/badge/github/i5anin/modules-soft__pf-forum.svg)](https://wakatime.com/badge/github/i5anin/modules-soft__pf-forum)  

Гибкая система для работы с таблицами: динамическое построение, иерархическая структура в сборках, адаптивные компоненты.

---

## 📂 Структура проекта
```
📦 src
├── 📂 app
│   ├── 📗 App.vue 
│   ├── 📜 main.js  — Главный файл инициализации Vue-приложения
│   └── 📜 router.js  — Конфигурация маршрутизации Vue
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
├── 📂 pages
│   ├── 📂 auth
│   │   └── 📗 PagesLogin.vue 
│   │
│   ├── 📂 dev
│   │   └── 📗 RouteExplorer.vue 
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
│   │   ├── 📂 base
│   │   │   ├── 📜 apiClient.js 
│   │   │   ├── 📜 authApi.js 
│   │   │   ├── 📜 authClient.js 
│   │   │   ├── 📜 responseHandlers.js 
│   │   │   └── 📜 tokenService.js 
│   │   │
│   │   ├── 📜 clients.js 
│   │   ├── 📜 list.js 
│   │   ├── 📜 nom_dir.js 
│   │   ├── 📜 nom_info.js 
│   │   ├── 📜 nom_list.js 
│   │   ├── 📜 nomListApi.test.js 
│   │   ├── 📜 update.js 
│   │   └── 📜 zagotovka.js 
│   │
│   ├── 📂 forms
│   │   └── 📗 DateRangeFilters.vue 
│   │
│   ├── 📂 lib
│   │   ├── 📜 formatters.js 
│   │   └── 📜 localize-ru.js 
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
│   ├── 📂 ui
│   │   ├── 📗 DisplayStatus.vue 
│   │   ├── 📗 DisplayStrategy.vue 
│   │   ├── 📜 icons.js 
│   │   ├── 📗 LoadingProgressBar.vue 
│   │   ├── 📗 LoadingSpinner.vue 
│   │   └── 📗 LoadingTableSkeleton.vue 
│   │
│   ├── 📂 widgets
│   │   ├── 📗 PageSizeSelect.vue 
│   │   ├── 📗 PaginationControl.vue 
│   │   └── 📗 SearchInput.vue 
│   │
│   └── 📂 zagotovka
│       └── 📗 ModalZagotovka.vue 
│
└── 📂 widgets
    ├── 📂 error
    │   ├── 📗 BaseToast.vue 
    │   └── 📜 store.js  — Хранилище данных (Pinia, Vuex)
    │
    ├── 📂 layout
    │   ├── 📗 AppBreadcrumbs.vue 
    │   ├── 📗 AppHeader.vue 
    │   └── 📗 AppMenu.vue 
    │
    └── 📂 modal-tools
        ├── 📂 api — ⭐ Модули взаимодействия с сервером
        │   └── 📜 tools.js 
        │
        └── 📂 components — ⭐ Переиспользуемые Vue-компоненты
            ├── 📗 AddedInstrumentsTable.vue 
            ├── 📗 PagesModalTools.vue 
            └── 📗 ProposedInstrumentsTable.vue 
```

---

## 📊 Статистика проекта

- 📄 **Всего файлов**: 60
- 📜 **Всего строк кода**: 5154


### 📁 Количество файлов и строк (`src`):
  - .vue: 37 файлов, 4087 строк
  - .js: 23 файлов, 1067 строк

### 📊 Топ-5 длинных файлов (`src`):
- 🔍 SborRow.vue — 231 строк
- 🔍 formatters.js — 211 строк
- 🔍 router.js — 193 строк
- 🔍 DataTable.vue — 187 строк
- 🔍 PagesModalTools.vue — 158 строк


