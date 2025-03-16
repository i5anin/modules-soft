# 📌 Модульный фронтенд универсальных таблиц  

[![wakatime](https://wakatime.com/badge/github/i5anin/modules-soft__pf-forum.svg)](https://wakatime.com/badge/github/i5anin/modules-soft__pf-forum)  

Гибкая система для работы с таблицами: динамическое построение, иерархическая структура в сборках, адаптивные компоненты.

---

## 📂 Структура проекта
```
📦 client/src
📂 assets — ⭐ Статические файлы (изображения, иконки, шрифты)
┣ 📃 logo-pf-forum-mini.svg (18 строк)
┗ 📃 logo-pf-forum.svg (22 строк)
📂 entities
┗ 📂 auth
  ┗ 📜 authStore.js (59 строк)
📂 modules — ⭐ Функциональные модули системы
┣ 📂 _main
┃ ┣ 📂 components — ⭐ Переиспользуемые Vue-компоненты
┃ ┃ ┣ 📗 Breadcrumbs.vue (48 строк)
┃ ┃ ┣ 📗 Header.vue (62 строк)
┃ ┃ ┗ 📗 Menu.vue (103 строк)
┃ ┗ 📂 store — ⭐ Глобальное хранилище данных (Pinia, Vuex)
┃   ┗ 📜 index.js (30 строк) — Точка входа модуля "store"
┣ 📂 api — ⭐ Модули взаимодействия с сервером
┃ ┣ 📜 apiClient.js (8 строк)
┃ ┣ 📜 authApi.js (35 строк)
┃ ┣ 📜 authClient.js (24 строк)
┃ ┣ 📜 responseHandlers.js (10 строк)
┃ ┗ 📜 tokenService.js (18 строк)
┣ 📂 counterparties
┣ 📂 dev
┃ ┣ 📗 fieldsProcessor.vue (83 строк)
┃ ┗ 📗 fieldsWatch.vue (214 строк)
┣ 📂 form-2-card-noms
┃ ┗ 📂 components — ⭐ Переиспользуемые Vue-компоненты
┃   ┣ 📗 CardComment.vue (58 строк)
┃   ┗ 📗 Form2CardNoms.vue (113 строк)
┣ 📂 form-3-nom
┃ ┣ 📂 components — ⭐ Переиспользуемые Vue-компоненты
┃ ┃ ┣ 📂 card
┃ ┃ ┃ ┣ 📗 EditableField.vue (64 строк)
┃ ┃ ┃ ┗ 📗 ReadonlyField.vue (83 строк)
┃ ┃ ┗ 📗 Form3Card.vue (114 строк)
┃ ┗ 📂 utils
┃   ┗ 📜 calculateHeight.js (7 строк)
┣ 📂 modal-tools
┃ ┣ 📂 api — ⭐ Модули взаимодействия с сервером
┃ ┃ ┗ 📜 tools.js (19 строк)
┃ ┗ 📂 components — ⭐ Переиспользуемые Vue-компоненты
┃   ┣ 📗 AddedInstrumentsTable.vue (155 строк)
┃   ┣ 📗 PagesModalTools.vue (161 строк)
┃   ┗ 📗 ProposedInstrumentsTable.vue (153 строк)
┣ 📂 shared
┃ ┣ 📂 components — ⭐ Переиспользуемые Vue-компоненты
┃ ┃ ┣ 📂 common
┃ ┃ ┃ ┗ 📗 WarningMessage.vue (36 строк)
┃ ┃ ┣ 📂 forms
┃ ┃ ┃ ┗ 📗 DateRangeFilters.vue (77 строк)
┃ ┃ ┣ 📂 pagination
┃ ┃ ┃ ┣ 📗 PageSizeSelector.vue (35 строк)
┃ ┃ ┃ ┗ 📗 Pagination.vue (143 строк)
┃ ┃ ┣ 📂 search
┃ ┃ ┃ ┗ 📗 SearchBar.vue (90 строк)
┃ ┃ ┗ 📂 ui
┃ ┃   ┣ 📗 BackButton.vue (59 строк)
┃ ┃   ┣ 📗 LoadingSpinner.vue (29 строк)
┃ ┃   ┣ 📗 StatusDisplay.vue (80 строк)
┃ ┃   ┣ 📗 StrategyDisplay.vue (150 строк)
┃ ┃   ┗ 📗 ThinProgressBar.vue (69 строк)
┃ ┣ 📂 logic
┃ ┃ ┗ 📜 statuses.js (83 строк)
┃ ┣ 📂 tables
┃ ┃ ┣ 📂 sborka
┃ ┃ ┃ ┣ 📂 api — ⭐ Модули взаимодействия с сервером
┃ ┃ ┃ ┃ ┗ 📜 update.js (17 строк)
┃ ┃ ┃ ┣ 📗 PendingUpdatesOverlay.vue (94 строк)
┃ ┃ ┃ ┣ 📗 SborMain.vue (96 строк)
┃ ┃ ┃ ┣ 📗 SborRow.vue (176 строк)
┃ ┃ ┃ ┗ 📜 tableStore.js (64 строк)
┃ ┃ ┣ 📂 sborka-server
┃ ┃ ┃ ┗ 📗 ServerSideSborka.vue (131 строк)
┃ ┃ ┣ 📂 table
┃ ┃ ┃ ┗ 📗 BaseTable.vue (98 строк)
┃ ┃ ┗ 📂 table-server
┃ ┃   ┣ 📗 DataTable.vue (168 строк)
┃ ┃   ┣ 📗 EditModal.vue (124 строк)
┃ ┃   ┗ 📗 PaginatedDataTable.vue (142 строк)
┃ ┗ 📂 zagotovka
┃   ┣ 📂 api — ⭐ Модули взаимодействия с сервером
┃   ┃ ┗ 📜 zagotovka.js (18 строк)
┃   ┗ 📗 ModalZagotovka.vue (127 строк)
┗ 📜 locales.js (23 строк)
📂 pages
┣ 📂 admin
┃ ┣ 📂 dynamic-docs
┃ ┃ ┣ 📂 components — ⭐ Переиспользуемые Vue-компоненты
┃ ┃ ┃ ┣ 📗 ChildrenList.vue (27 строк)
┃ ┃ ┃ ┣ 📗 CollapsibleSection.vue (35 строк)
┃ ┃ ┃ ┣ 📗 EmitsList.vue (21 строк)
┃ ┃ ┃ ┣ 📗 MethodsList.vue (42 строк)
┃ ┃ ┃ ┗ 📗 PropsList.vue (25 строк)
┃ ┃ ┣ ⚙️ descriptionData.json (47 строк)
┃ ┃ ┣ 📗 InfoComponent.vue (141 строк)
┃ ┃ ┗ 📗 PagesViewer.vue (11 строк)
┃ ┣ 📗 Home.vue (134 строк)
┃ ┗ 📗 Structure.vue (50 строк)
┣ 📂 auth
┃ ┗ 📗 Login.vue (104 строк)
┣ 📂 form-1
┃ ┣ 📂 api — ⭐ Модули взаимодействия с сервером
┃ ┃ ┣ 📜 clients.js (15 строк)
┃ ┃ ┗ 📜 list.js (21 строк)
┃ ┣ 📗 PagesClients.vue (135 строк)
┃ ┗ 📗 PagesTableWrapper.vue (157 строк)
┣ 📂 form-2
┃ ┣ 📂 api — ⭐ Модули взаимодействия с сервером
┃ ┃ ┣ 📜 nom_dir.js (20 строк)
┃ ┃ ┗ 📜 nom_list.js (36 строк)
┃ ┣ 📗 PagesCardNoms.vue (106 строк)
┃ ┗ 📗 PagesClientNoms.vue (133 строк)
┗ 📂 form-3
  ┣ 📂 api — ⭐ Модули взаимодействия с сервером
  ┃ ┗ 📜 nom_info.js (21 строк)
  ┗ 📗 PagesDetailNom.vue (131 строк)
📂 store — ⭐ Глобальное хранилище данных (Pinia, Vuex)
┗ 📜 home.module.js (31 строк)
📂 utils
┣ 📂 dev
┃ ┗ 📜 fieldsProcessor.js (89 строк)
┣ 📜 formatters.js (206 строк)
┣ 📜 icons.js (32 строк)
┗ 📜 localize-ru.js (15 строк)
📗 App.vue (15 строк)
📜 main.js (17 строк) — Главный файл инициализации Vue-приложения
📜 router.js (208 строк) — Конфигурация маршрутизации Vue
```

---

## 📊 Статистика проекта

- 📄 **Всего файлов**: 77
- 📜 **Всего строк кода**: 5815


### 📁 Количество файлов и строк (`client/src`):
  - .svg: 2 файлов, 40 строк
  - .js: 26 файлов, 1126 строк
  - .vue: 48 файлов, 4602 строк
  - .json: 1 файлов, 47 строк

### 📊 Топ-5 длинных файлов (`client/src`):
- 🔍 fieldsWatch.vue — 214 строк
- 🔍 router.js — 208 строк
- 🔍 formatters.js — 206 строк
- 🔍 SborRow.vue — 176 строк
- 🔍 DataTable.vue — 168 строк


