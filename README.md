# 📌 Модульный фронтенд универсальных таблиц  

[![wakatime](https://wakatime.com/badge/github/i5anin/modules-soft__pf-forum.svg)](https://wakatime.com/badge/github/i5anin/modules-soft__pf-forum)  

Гибкая система для работы с таблицами: динамическое построение, иерархическая структура в сборках, адаптивные компоненты.

---

## 📂 Структура проекта
```
📦 src
├── 📂 assets — ⭐ Статические файлы (изображения, иконки, шрифты)

├── 📂 entities

│   └── 📂 auth
│       └── 📜 authStore.js (65 строк)
├── 📂 modules — ⭐ Функциональные модули системы

│   ├── 📂 _main
│   │   ├── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │   │   ├── 📗 AppBreadcrumbs.vue (62 строк)
│   │   │   ├── 📗 AppHeader.vue (102 строк)
│   │   │   └── 📗 AppMenu.vue (99 строк)
│   │   └── 📂 store — ⭐ Глобальное хранилище данных (Pinia, Vuex)
│   │       └── 📜 store.js (30 строк) — Хранилище данных (Pinia, Vuex)
│   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   ├── 📜 apiClient.js (8 строк)
│   │   ├── 📜 authApi.js (35 строк)
│   │   ├── 📜 authClient.js (24 строк)
│   │   ├── 📜 responseHandlers.js (10 строк)
│   │   └── 📜 tokenService.js (18 строк)
│   ├── 📂 dev
│   │   ├── 📗 fieldsProcessor.vue (81 строк)
│   │   └── 📗 fieldsWatch.vue (178 строк)
│   ├── 📂 form-2-card-noms
│   │   └── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │       ├── 📗 CardComment.vue (58 строк)
│   │       └── 📗 Form2CardNoms.vue (134 строк)
│   ├── 📂 form-3-nom
│   │   ├── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │   │   ├── 📂 card
│   │   │   │   ├── 📗 EditableField.vue (62 строк)
│   │   │   │   └── 📗 ReadonlyField.vue (81 строк)
│   │   │   └── 📗 Form3Card.vue (115 строк)
│   │   └── 📂 utils
│   │       └── 📜 calculateHeight.js (7 строк)
│   ├── 📂 modal-tools
│   │   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   │   └── 📜 tools.js (19 строк)
│   │   └── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │       ├── 📗 AddedInstrumentsTable.vue (155 строк)
│   │       ├── 📗 PagesModalTools.vue (158 строк)
│   │       └── 📗 ProposedInstrumentsTable.vue (153 строк)
│   ├── 📂 shared
│   │   ├── 📂 components — ⭐ Переиспользуемые Vue-компоненты
│   │   │   ├── 📂 common
│   │   │   │   └── 📗 WarningMessage.vue (36 строк)
│   │   │   ├── 📂 forms
│   │   │   │   └── 📗 DateRangeFilters.vue (77 строк)
│   │   │   ├── 📂 pagination
│   │   │   │   ├── 📗 PageSizeSelector.vue (35 строк)
│   │   │   │   └── 📗 TablePagination.vue (140 строк)
│   │   │   ├── 📂 search
│   │   │   │   └── 📗 SearchBar.vue (87 строк)
│   │   │   └── 📂 ui
│   │   │       ├── 📗 BackButton.vue (59 строк)
│   │   │       ├── 📗 LoadingSpinner.vue (29 строк)
│   │   │       ├── 📗 StatusDisplay.vue (80 строк)
│   │   │       ├── 📗 StrategyDisplay.vue (149 строк)
│   │   │       └── 📗 ThinProgressBar.vue (69 строк)
│   │   ├── 📂 logic
│   │   │   └── 📜 statuses.js (83 строк)
│   │   ├── 📂 tables
│   │   │   ├── 📂 sborka
│   │   │   │   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   │   │   │   └── 📜 update.js (17 строк)
│   │   │   │   ├── 📗 PendingUpdatesOverlay.vue (81 строк)
│   │   │   │   ├── 📗 SborMain.vue (114 строк)
│   │   │   │   ├── 📗 SborRow.vue (168 строк)
│   │   │   │   └── 📜 tableStore.js (64 строк)
│   │   │   ├── 📂 sborka-server
│   │   │   │   └── 📗 ServerSideSborka.vue (122 строк)
│   │   │   ├── 📂 table
│   │   │   │   └── 📗 BaseTable.vue (98 строк)
│   │   │   └── 📂 table-server
│   │   │       ├── 📗 DataTable.vue (166 строк)
│   │   │       ├── 📗 EditModal.vue (131 строк)
│   │   │       └── 📗 PaginatedDataTable.vue (139 строк)
│   │   └── 📂 zagotovka
│   │       ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │       │   └── 📜 zagotovka.js (18 строк)
│   │       └── 📗 ModalZagotovka.vue (122 строк)
│   └── 📜 locales.js (23 строк)
├── 📂 pages

│   ├── 📂 admin
│   │   ├── 📗 AdminHome.vue (134 строк)
│   │   └── 📗 Structure.vue (50 строк)
│   ├── 📂 auth
│   │   └── 📗 AuthLogin.vue (101 строк)
│   ├── 📂 form-1
│   │   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   │   ├── 📜 clients.js (15 строк)
│   │   │   └── 📜 list.js (21 строк)
│   │   ├── 📗 PagesClients.vue (134 строк)
│   │   └── 📗 PagesTableWrapper.vue (154 строк)
│   ├── 📂 form-2
│   │   ├── 📂 api — ⭐ Модули взаимодействия с сервером
│   │   │   ├── 📜 nom_dir.js (20 строк)
│   │   │   └── 📜 nom_list.js (36 строк)
│   │   ├── 📗 PagesCardNoms.vue (105 строк)
│   │   └── 📗 PagesClientNoms.vue (135 строк)
│   └── 📂 form-3
│       ├── 📂 api — ⭐ Модули взаимодействия с сервером
│       │   └── 📜 nom_info.js (21 строк)
│       └── 📗 PagesDetailNom.vue (130 строк)
├── 📂 store — ⭐ Глобальное хранилище данных (Pinia, Vuex)

│   └── 📜 home.module.js (16 строк)
├── 📂 utils

│   ├── 📂 dev
│   │   └── 📜 fieldsProcessor.js (88 строк)
│   ├── 📜 formatters.js (211 строк)
│   ├── 📜 icons.js (32 строк)
│   └── 📜 localize-ru.js (15 строк)
├── 📗 App.vue (15 строк)
├── 📜 main.js (17 строк) — Главный файл инициализации Vue-приложения
└── 📜 router.js (197 строк) — Конфигурация маршрутизации Vue
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


