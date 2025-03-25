# Vue.js Проект [![wakatime](https://wakatime.com/badge/user/a12eb6bb-966a-41dc-b67d-4ae0f101af55/project/f69366dd-9709-493c-bdd0-1681f774dd3b.svg)](https://wakatime.com/badge/user/a12eb6bb-966a-41dc-b67d-4ae0f101af55/project/f69366dd-9709-493c-bdd0-1681f774dd3b)

Модульный проект на Vue.js для управления клиентами, заказами и их данными. Проект предоставляет динамическую таблицу с
возможностью сортировки, поиска, и фильтрации, а также поддержку добавочных и международных телефонных номеров.

### 📌 Основные маршруты

- **📦 Заказы**
  - [📋 Главная страница заказов](http://localhost:5173/orders)
  - [📄 Детали заказа](http://localhost:5173/orders/9814)
  - [📌 Конкретный элемент в заказе](http://localhost:5173/orders/9814/53537)

- **👥 Клиенты и 📜 Номенклатуры**
  - [📋 Список клиентов](http://localhost:5173/clients)
  - [📄 Номенклатура для клиента](http://localhost:5173/noms/418)

---

## 🛠 Описание проекта

Проект предназначен для управления данными клиентов и заказов через удобный интерфейс. Приложение поддерживает
пагинацию, сортировку, и фильтрацию данных, а также позволяет легко добавлять и управлять контентом через единый
модульный интерфейс.

---

## ⚙️ Установка и настройка

1. **Клонирование репозитория:**
   ```bash
   git clone https://github.com/ваше_имя_пользователя/имя_проекта.git
   cd имя_проекта
   ```

---

## 📂 Структура проекта

```
📦 src/
┣ 📗 App.vue (18 строк)
┣ 📂 assets/
  ┣ 🎨 FormFloatingField.css (33 строк)
  ┣ 📃 logo-pf-forum-mini.svg (18 строк)
  ┣ 📃 logo-pf-forum.svg (22 строк)
┣ 📂 entities/
  ┣ 📂 auth/
    ┣ 📜 authStore.js (65 строк)
┣ 📜 main.js (17 строк)
┣ 📂 modules/
  ┣ 📂 api/
    ┣ 📜 apiClient.js (8 строк)
    ┣ 📜 authApi.js (35 строк)
    ┣ 📜 authClient.js (24 строк)
    ┣ 📜 responseHandlers.js (10 строк)
    ┣ 📜 tokenService.js (18 строк)
  ┣ 📂 dev/
    ┣ 📗 fieldsProcessor.vue (83 строк)
    ┣ 📗 fieldsWatch.vue (188 строк)
    ┣ 🎨 TableStyles.css (35 строк)
  ┣ 📂 form-2-card-noms/
    ┣ 📂 components/
      ┣ 📗 CardComment.vue (58 строк)
      ┣ 📗 Form2CardNoms.vue (120 строк)
  ┣ 📂 form-3-nom/
    ┣ 📂 components/
      ┣ 📂 card/
        ┣ 📗 EditableField.vue (73 строк)
        ┣ 📗 ReadonlyField.vue (92 строк)
      ┣ 📗 Form3Card.vue (121 строк)
    ┣ 📂 utils/
      ┣ 📜 calculateHeight.js (7 строк)
  ┣ 📜 locales.js (23 строк)
  ┣ 📂 modal-tools/
    ┣ 📂 api/
      ┣ 📜 tools.js (19 строк)
    ┣ 📂 components/
      ┣ 📗 AddedInstrumentsTable.vue (163 строк)
      ┣ 📗 PagesModalTools.vue (164 строк)
      ┣ 📗 ProposedInstrumentsTable.vue (161 строк)
  ┣ 📂 shared/
    ┣ 📂 components/
      ┣ 📂 common/
        ┣ 📗 WarningMessage.vue (39 строк)
      ┣ 📂 forms/
        ┣ 📗 DateRangeFilters.vue (77 строк)
      ┣ 📂 pagination/
        ┣ 📗 PageSizeSelector.vue (42 строк)
        ┣ 📗 Pagination.vue (168 строк)
      ┣ 📂 search/
        ┣ 📗 SearchBar.vue (90 строк)
      ┣ 📂 ui/
        ┣ 📗 BackButton.vue (71 строк)
        ┣ 📗 LoadingSpinner.vue (35 строк)
        ┣ 📗 StatusDisplay.vue (83 строк)
        ┣ 📗 StrategyDisplay.vue (150 строк)
        ┣ 📗 ThinProgressBar.vue (69 строк)
    ┣ 📂 logic/
      ┣ 📜 statuses.js (83 строк)
    ┣ 📂 tables/
      ┣ 📂 sborka/
        ┣ 📂 api/
          ┣ 📜 update.js (17 строк)
        ┣ 📗 PendingUpdatesOverlay.vue (101 строк)
        ┣ 📗 SborMain.vue (119 строк)
        ┣ 🎨 SborRow.css (52 строк)
        ┣ 📗 SborRow.vue (180 строк)
        ┣ 📜 tableStore.js (64 строк)
      ┣ 📂 sborka-server/
        ┣ 📗 ServerSideSborka.vue (127 строк)
      ┣ 📂 table/
        ┣ 📗 BaseTable.vue (107 строк)
      ┣ 📂 table-server/
        ┣ 📗 DataTable.vue (186 строк)
        ┣ 📗 EditModal.vue (127 строк)
        ┣ 📗 PaginatedDataTable.vue (148 строк)
    ┣ 📂 zagotovka/
      ┣ 📂 api/
        ┣ 📜 zagotovka.js (18 строк)
      ┣ 📗 ModalZagotovka.vue (130 строк)
  ┣ 📂 _main/
    ┣ 📂 components/
      ┣ 📗 AppBreadcrumbs.vue (61 строк)
      ┣ 📗 AppHeader.vue (108 строк)
      ┣ 📗 AppMenu.vue (118 строк)
    ┣ 📂 store/
      ┣ 📜 index.js (30 строк)
┣ 📂 pages/
  ┣ 📂 admin/
    ┣ 📂 dynamic-docs/
      ┣ 📂 components/
        ┣ 📗 ChildrenList.vue (27 строк)
        ┣ 📗 CollapsibleSection.vue (38 строк)
        ┣ 📗 EmitsList.vue (25 строк)
        ┣ 📗 MethodsList.vue (52 строк)
        ┣ 📗 PropsList.vue (32 строк)
      ┣ ⚙️ descriptionData.json (47 строк)
      ┣ 📗 InfoComponent.vue (160 строк)
      ┣ 📗 PagesViewer.vue (11 строк)
    ┣ 📗 Home.vue (181 строк)
    ┣ 📗 Structure.vue (59 строк)
  ┣ 📂 auth/
    ┣ 📗 AuthLogin.vue (125 строк)
  ┣ 📂 form-1/
    ┣ 📂 api/
      ┣ 📜 clients.js (15 строк)
      ┣ 📜 list.js (21 строк)
    ┣ 📗 PagesClients.vue (135 строк)
    ┣ 📗 PagesTableWrapper.vue (154 строк)
  ┣ 📂 form-2/
    ┣ 📂 api/
      ┣ 📜 nom_dir.js (20 строк)
      ┣ 📜 nom_list.js (36 строк)
    ┣ 📗 PagesCardNoms.vue (106 строк)
    ┣ 📗 PagesClientNoms.vue (133 строк)
  ┣ 📂 form-3/
    ┣ 📂 api/
      ┣ 📜 nom_info.js (21 строк)
    ┣ 📗 PagesDetailNom.vue (131 строк)
┣ 📜 router.js (208 строк)
┣ 📂 store/
  ┣ 📜 home.module.js (31 строк)
┣ 📂 utils/
  ┣ 📂 dev/
    ┣ 📜 fieldsProcessor.js (89 строк)
  ┣ 📜 formatters.js (210 строк)
  ┣ 📜 icons.js (32 строк)
  ┣ 📜 localize-ru.js (15 строк)
```

---

## 📊 Статистика проекта

- 📄 **Всего файлов**: 80
- 📜 **Всего строк кода**: 6289

### 📁 Количество файлов и строк по типам:
  - .vue: 48 файлов, 4946 строк
  - .css: 3 файлов, 120 строк
  - .svg: 2 файлов, 40 строк
  - .js: 26 файлов, 1136 строк
  - .json: 1 файлов, 47 строк

### 📊 Топ-5 файлов для потенциального рефакторинга:
- 🔍 D:\GitHub\modules-soft__pf-forum\client\src\utils\formatters.js — 210 строк
- 🔍 D:\GitHub\modules-soft__pf-forum\client\src\router.js — 208 строк
- 🔍 D:\GitHub\modules-soft__pf-forum\client\src\modules\dev\fieldsWatch.vue — 188 строк
- 🔍 D:\GitHub\modules-soft__pf-forum\client\src\modules\shared\tables\table-server\DataTable.vue — 186 строк
- 🔍 D:\GitHub\modules-soft__pf-forum\client\src\pages\admin\Home.vue — 181 строк
