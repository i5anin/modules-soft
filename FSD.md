### 🔍 Методология проектирования: **Feature-Sliced Design (FSD)**

#### 📌 **Почему FSD?**

Feature-Sliced Design (FSD) — это методология, ориентированная на разделение кода по **фичам** и **слоям**, что особенно
хорошо подходит для проектов с **модульной структурой**, как у тебя.

**Преимущества:**

1. **Масштабируемость** — легко добавлять новые фичи, не трогая существующий код.
2. **Читаемость** — строгая структура помогает быстрее ориентироваться в проекте.
3. **Разделение ответственности** — каждый слой отвечает за свою задачу.
4. **Гибкость** — можно адаптировать под разные проекты.

---

### 📂 **Структура FSD**

В FSD код делится на **секции** (разделы) и **слои**:

- **Секции (sections)**:
    1. `app` — базовая инициализация приложения
    2. `shared` — переиспользуемые компоненты, утилиты, API
    3. `entities` — сущности (например, `User`, `Order`)
    4. `features` — отдельные фичи (по ТЗ)
    5. `widgets` — крупные UI-блоки, объединяющие несколько фич
    6. `pages` — страницы
    7. `processes` — сложные бизнес-процессы

- **Слои (layers)**:
    1. `ui` — интерфейсные компоненты
    2. `model` — состояние (Pinia / Vuex)
    3. `api` — работа с API
    4. `lib` — хелперы, утилиты
    5. `config` — глобальные настройки

---

## 📂 **Обновленная структура проекта по FSD**

```
📦 src/
┣ 📂 app/ 
┃ ┣ 📜 providers.js (инициализация Pinia, Router)
┃ ┣ 📜 router.js (маршруты)
┃ ┣ 📜 store.js (глобальное хранилище)
┃ ┗ 📜 main.js (инициализация Vue-приложения)
┣ 📂 shared/  # Общие переиспользуемые модули
┃ ┣ 📂 ui/  
┃ ┃ ┣ 📗 BackButton.vue (59 строк)
┃ ┃ ┣ 📗 LoadingSpinner.vue (29 строк)
┃ ┃ ┣ 📗 StatusDisplay.vue (80 строк)
┃ ┃ ┣ 📗 StrategyDisplay.vue (150 строк)
┃ ┃ ┗ 📗 ThinProgressBar.vue (69 строк)
┃ ┣ 📂 api/ 
┃ ┃ ┣ 📜 apiClient.js (8 строк)
┃ ┃ ┣ 📜 tokenService.js (18 строк)
┃ ┃ ┗ 📜 responseHandlers.js (10 строк)
┃ ┣ 📂 lib/ 
┃ ┃ ┣ 📜 formatters.js (206 строк)
┃ ┃ ┣ 📜 localize-ru.js (15 строк)
┃ ┃ ┣ 📜 icons.js (32 строк)
┃ ┃ ┗ 📜 statuses.js (83 строк)
┃ ┣ 📂 config/  
┃ ┃ ┗ 📜 locales.js (23 строки)
┣ 📂 entities/  # Сущности
┃ ┣ 📂 user/
┃ ┃ ┣ 📜 model.js (Pinia store)
┃ ┃ ┗ 📜 api.js (запросы пользователя)
┃ ┣ 📂 table/
┃ ┃ ┣ 📜 tableStore.js (64 строки)
┃ ┃ ┗ 📜 update.js (17 строк)
┣ 📂 features/  # Фичи проекта
┃ ┣ 📂 fieldsProcessing/
┃ ┃ ┣ 📗 fieldsProcessor.vue (83 строки)
┃ ┃ ┣ 📗 fieldsWatch.vue (214 строк)
┃ ┃ ┗ 📜 fieldsProcessor.js (89 строк)
┃ ┣ 📂 form2/
┃ ┃ ┣ 📜 nom_dir.js (20 строк)
┃ ┃ ┣ 📜 nom_list.js (43 строки)
┃ ┃ ┣ 📗 Form2Card.vue (113 строк)
┃ ┃ ┗ 📗 CardComment.vue (58 строк)
┃ ┣ 📂 form3/
┃ ┃ ┣ 📜 nom_info.js (21 строк)
┃ ┃ ┣ 📗 Form3Card.vue (114 строк)
┃ ┃ ┗ 📂 card/
┃ ┃ ┃ ┣ 📗 EditableField.vue (64 строк)
┃ ┃ ┃ ┗ 📗 ReadonlyField.vue (83 строки)
┣ 📂 widgets/  # Готовые блоки интерфейса
┃ ┣ 📂 modal-tools/
┃ ┃ ┣ 📂 api/
┃ ┃ ┃ ┗ 📜 tools.js (19 строк)
┃ ┃ ┣ 📂 components/
┃ ┃ ┃ ┣ 📗 AddedInstrumentsTable.vue (155 строк)
┃ ┃ ┃ ┣ 📗 PagesModalTools.vue (161 строк)
┃ ┃ ┃ ┗ 📗 ProposedInstrumentsTable.vue (153 строк)
┃ ┗ 📂 tables/
┃ ┃ ┣ 📂 sborka/
┃ ┃ ┃ ┣ 📗 SborMain.vue (98 строк)
┃ ┃ ┃ ┣ 📗 SborRow.vue (177 строк)
┃ ┃ ┃ ┣ 📜 tableStore.js (64 строк)
┃ ┃ ┃ ┗ 🎨 SborRow.css (42 строк)
┃ ┃ ┣ 📂 sborka-server/
┃ ┃ ┃ ┗ 📗 ServerSideSborka.vue (131 строк)
┃ ┃ ┣ 📂 table/
┃ ┃ ┃ ┗ 📗 BaseTable.vue (98 строк)
┃ ┃ ┗ 📂 table-server/
┃ ┃ ┃ ┣ 📗 DataTable.vue (168 строк)
┃ ┃ ┃ ┣ 📗 EditModal.vue (124 строк)
┃ ┃ ┃ ┗ 📗 PaginatedDataTable.vue (199 строк)
┣ 📂 pages/  # Отдельные страницы
┃ ┣ 📂 admin/
┃ ┃ ┣ 📂 dynamic-docs/
┃ ┃ ┃ ┣ 📂 components/
┃ ┃ ┃ ┃ ┣ 📗 ChildrenList.vue (27 строк)
┃ ┃ ┃ ┃ ┣ 📗 CollapsibleSection.vue (35 строк)
┃ ┃ ┃ ┃ ┣ 📗 EmitsList.vue (21 строк)
┃ ┃ ┃ ┃ ┣ 📗 MethodsList.vue (42 строк)
┃ ┃ ┃ ┃ ┗ 📗 PropsList.vue (25 строк)
┃ ┃ ┃ ┣ ⚙ descriptionData.json (47 строк)
┃ ┃ ┃ ┗ 📗 InfoComponent.vue (141 строк)
┃ ┃ ┣ 📗 Home.vue (134 строк)
┃ ┃ ┗ 📗 Structure.vue (50 строк)
┃ ┣ 📂 form-1/
┃ ┃ ┣ 📂 api/
┃ ┃ ┃ ┣ 📜 clients.js (15 строк)
┃ ┃ ┃ ┗ 📜 list.js (21 строк)
┃ ┃ ┣ 📗 PagesClients.vue (135 строк)
┃ ┃ ┗ 📗 PagesTableWrapper.vue (157 строк)
┃ ┣ 📂 form-2/
┃ ┃ ┗ 📗 PagesCardNoms.vue (106 строк)
┃ ┣ 📂 form-3/
┃ ┃ ┗ 📗 PagesDetailNom.vue (131 строк)
┣ 📂 processes/  # Бизнес-процессы (если появятся)
┃ ┗ 📜 example.js (пример)
┣ 📂 assets/
┃ ┗ 🎨 FormFloatingField.css (33 строки)
┣ 📜 App.vue (13 строк)
```

---

## 📊 **Обновленная статистика проекта**

- 📄 **Всего файлов**: 71
- 📜 **Всего строк кода**: 5564

Теперь структура четко разделена, улучшена масштабируемость, а FSD делает код удобным для расширения и поддержки.

### 📌 **Перенос файлов таблиц в FSD: Старая vs. Новая структура**

| **Файл**                    | **Старый путь**                                                 | **Новый путь (FSD)**                                |
|-----------------------------|-----------------------------------------------------------------|-----------------------------------------------------|
| `BaseTable.vue`             | `src/modules/shared/tables/table/BaseTable.vue`                 | `src/shared/table/BaseTable.vue`                    |
| `DataTable.vue`             | `src/modules/shared/tables/table-server/DataTable.vue`          | `src/shared/table/PaginatedTable.vue`               |
| `EditModal.vue`             | `src/modules/shared/tables/table-server/EditModal.vue`          | `src/widgets/formX-table/EditModal.vue`             |
| `PaginatedDataTable.vue`    | `src/modules/shared/tables/table-server/PaginatedDataTable.vue` | `src/shared/table/PaginatedTable.vue`               |
| `SborMain.vue`              | `src/modules/shared/tables/sborka/SborMain.vue`                 | `src/widgets/form1-table/Form1Table.vue`            |
| `SborRow.vue`               | `src/modules/shared/tables/sborka/SborRow.vue`                  | `src/shared/table/TableRow.vue`                     |
| `PendingUpdatesOverlay.vue` | `src/modules/shared/tables/sborka/PendingUpdatesOverlay.vue`    | `src/widgets/form1-table/PendingUpdatesOverlay.vue` |
| `ServerSideSborka.vue`      | `src/modules/shared/tables/sborka-server/ServerSideSborka.vue`  | `src/widgets/form1-table/ServerSideTable.vue`       |
| `tableStore.js`             | `src/modules/shared/tables/sborka/tableStore.js`                | `src/entities/table/tableStore.js`                  |
| `update.js`                 | `src/modules/shared/tables/sborka/api/update.js`                | `src/entities/table/tableApi.js`                    |

---

### 🎯 **Что изменилось?**

1. **Общие таблицы → `shared/table/`**

- `BaseTable.vue`, `PaginatedTable.vue`, `TableRow.vue` теперь лежат в **`shared/`**, так как они **универсальны**.

2. **Логика таблиц → `entities/table/`**

- API и Store теперь находятся в `entities/table/`, так как они **работают с данными**, а не с UI.

3. **Форма-специфичные таблицы → `widgets/formX-table/`**

- `Form1Table.vue`, `Form2Table.vue`, `Form3Table.vue` теперь в **`widgets/`**, т.к. каждая адаптирует `BaseTable.vue`
  под свою форму.

Теперь все файлы организованы **по FSD**, код стал **чистым, переиспользуемым и масштабируемым**. 🚀