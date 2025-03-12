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
┣ 📗 App.vue
┣ 📂 assets/
  ┣ 🎨 FormFloatingField.css
┣ 📜 main.js
┣ 📂 modules/
  ┣ 📂 api/
    ┣ 📜 apiClient.js
    ┣ 📜 responseHandlers.js
    ┣ 📜 tokenService.js
  ┣ 📂 dev/
    ┣ 📗 fieldsProcessor.vue
    ┣ 📗 fieldsWatch.vue
  ┣ 📂 form-2-card-noms/
    ┣ 📂 components/
      ┣ 📗 CardComment.vue
      ┣ 📗 Form2Card.vue
  ┣ 📂 form-3-nom/
    ┣ 📂 components/
      ┣ 📂 card/
        ┣ 📗 EditableField.vue
        ┣ 📗 ReadonlyField.vue
      ┣ 📗 Form3Card.vue
    ┣ 📂 utils/
      ┣ 📜 calculateHeight.js
  ┣ 📜 locales.js
  ┣ 📂 modal-tools/
    ┣ 📂 api/
      ┣ 📜 tools.js
    ┣ 📂 components/
      ┣ 📗 AddedInstrumentsTable.vue
      ┣ 📗 PagesModalTools.vue
      ┣ 📗 ProposedInstrumentsTable.vue
  ┣ 📂 shared/
    ┣ 📂 components/
      ┣ 📂 common/
        ┣ 📗 WarningMessage.vue
      ┣ 📂 forms/
        ┣ 📗 DateRangeFilters.vue
      ┣ 📂 pagination/
        ┣ 📗 PageSizeSelector.vue
        ┣ 📗 Pagination.vue
      ┣ 📂 search/
        ┣ 📗 SearchBar.vue
      ┣ 📂 ui/
        ┣ 📗 BackButton.vue
        ┣ 📗 LoadingSpinner.vue
        ┣ 📗 StatusDisplay.vue
        ┣ 📗 StrategyDisplay.vue
        ┣ 📗 ThinProgressBar.vue
    ┣ 📂 logic/
      ┣ 📜 statuses.js
    ┣ 📂 tables/
      ┣ 📂 sborka/
        ┣ 📂 api/
          ┣ 📜 update.js
        ┣ 📗 PendingUpdatesOverlay.vue
        ┣ 📗 SborMain.vue
        ┣ 🎨 SborRow.css
        ┣ 📗 SborRow.vue
        ┣ 📜 tableStore.js
      ┣ 📂 sborka-server/
        ┣ 📗 ServerSideSborka.vue
      ┣ 📂 table/
        ┣ 📗 BaseTable.vue
      ┣ 📂 table-server/
        ┣ 📗 DataTable.vue
        ┣ 📗 EditModal.vue
        ┣ 📗 PaginatedDataTable.vue
    ┣ 📂 zagotovka/
      ┣ 📂 api/
        ┣ 📜 zagotovka.js
      ┣ 📗 ModalZagotovka.vue
  ┣ 📂 _main/
    ┣ 📂 components/
      ┣ 📗 Navbar.vue
    ┣ 📂 store/
      ┣ 📜 index.js
┣ 📂 pages/
  ┣ 📂 admin/
    ┣ 📂 dynamic-docs/
      ┣ 📂 components/
        ┣ 📗 ChildrenList.vue
        ┣ 📗 CollapsibleSection.vue
        ┣ 📗 EmitsList.vue
        ┣ 📗 MethodsList.vue
        ┣ 📗 PropsList.vue
      ┣ ⚙ descriptionData.json
      ┣ 📗 InfoComponent.vue
      ┣ 📗 PagesViewer.vue
    ┣ 📗 Home.vue
    ┣ 📗 Structure.vue
  ┣ 📂 form-1/
    ┣ 📂 api/
      ┣ 📜 clients.js
      ┣ 📜 list.js
    ┣ 📗 PagesClients.vue
    ┣ 📗 PagesTableWrapper.vue
  ┣ 📂 form-2/
    ┣ 📂 api/
      ┣ 📜 nom_dir.js
      ┣ 📜 nom_list.js
    ┣ 📗 PagesCardNoms.vue
    ┣ 📗 PagesClientNoms.vue
  ┣ 📂 form-3/
    ┣ 📂 api/
      ┣ 📜 nom_info.js
    ┣ 📗 PagesDetailNom.vue
┣ 📜 router.js
┣ 📂 store/
  ┣ 📜 home.module.js
┣ 📂 utils/
  ┣ 📂 dev/
    ┣ 📜 fieldsProcessor.js
  ┣ 📜 formatters.js
  ┣ 📜 icons.js
  ┣ 📜 localize-ru.js
```
