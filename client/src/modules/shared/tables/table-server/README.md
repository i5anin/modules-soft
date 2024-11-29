Спасибо за указание! Теперь документирую **без упоминания Pinia**.

### Полный код для MD:

# Взаимодействие компонентов

## Общая структура системы

```mermaid
graph TD
    User[Пользователь] -->|Ввод данных| SearchBar[Поиск]
    User -->|Выбор даты| DateRangeFilters[Фильтр дат]
    User -->|Смена страницы| Pagination[Пагинация]
    SearchBar -->|Обновить параметры поиска| ServerSideTable[Таблица]
    DateRangeFilters -->|Обновить диапазон дат| ServerSideTable
    Pagination -->|Обновить номер страницы| ServerSideTable
    ServerSideTable -->|Запрос данных| API[Сервер API]
    API -->|Ответ с данными| ServerSideTable
    ServerSideTable -->|Обновление интерфейса| User
```

---

## Последовательность взаимодействий

### Сценарий: Поиск данных

```mermaid
sequenceDiagram
    participant User as Пользователь
    participant SearchBar as Поиск
    participant ServerSideTable as Таблица
    participant API as Сервер API

    User->>SearchBar: Вводит запрос
    SearchBar-->>ServerSideTable: Обновить параметры поиска
    ServerSideTable->>API: GET /items?search=<query>
    API-->>ServerSideTable: Ответ с данными
    ServerSideTable-->>User: Обновление интерфейса
```

---

### Сценарий: Выбор диапазона дат

```mermaid
sequenceDiagram
    participant User as Пользователь
    participant DateRangeFilters as Фильтр дат
    participant ServerSideTable as Таблица
    participant API as Сервер API

    User->>DateRangeFilters: Устанавливает диапазон дат
    DateRangeFilters-->>ServerSideTable: Обновить диапазон дат
    ServerSideTable->>API: GET /items?start=<start>&end=<end>
    API-->>ServerSideTable: Ответ с данными
    ServerSideTable-->>User: Обновление интерфейса
```

---

### Сценарий: Пагинация

```mermaid
sequenceDiagram
    participant User as Пользователь
    participant Pagination as Пагинация
    participant ServerSideTable as Таблица
    participant API as Сервер API

    User->>Pagination: Выбирает страницу
    Pagination-->>ServerSideTable: Обновить текущую страницу
    ServerSideTable->>API: GET /items?page=<page>
    API-->>ServerSideTable: Ответ с данными
    ServerSideTable-->>User: Обновление интерфейса
```

---

## Подробности взаимодействия компонентов

1. **SearchBar (Поиск)**:
   - Отправляет обновление в таблицу.
   - Генерирует запрос с параметрами поиска.

2. **DateRangeFilters (Фильтр дат)**:
   - Изменяет диапазон дат.
   - Передаёт новые даты в таблицу.

3. **Pagination (Пагинация)**:
   - Управляет сменой страниц.
   - Передаёт обновлённую страницу в таблицу.

4. **ServerSideTable (Таблица)**:
   - Собирает параметры (поиск, даты, пагинация).
   - Отправляет запрос на сервер API.
   - Отображает обновлённые данные.

5. **API (Сервер)**:
   - Обрабатывает запросы от таблицы.
   - Возвращает данные.

---

Если потребуется ещё что-то скорректировать или расширить, дайте знать!