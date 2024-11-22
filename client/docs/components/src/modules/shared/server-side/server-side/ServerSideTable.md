# ServerSideTable

## Props

| Prop name           | Description | Type    | Values | Default           |
| ------------------- | ----------- | ------- | ------ | ----------------- |
| items               |             | array   | -      |                   |
| headers             |             | array   | -      |                   |
| excluded            |             | array   | -      | []                |
| itemsPerPageOptions |             | array   | -      | [15, 30, 50, 100] |
| totalPages          |             | number  | -      |                   |
| totalCount          |             | number  | -      |                   |
| currentPage         |             | number  | -      |                   |
| sortColumn          |             | string  | -      | ''                |
| sortOrder           |             | string  | -      | 'asc'             |
| itemsPerPage        |             | number  | -      |                   |
| datepicker          |             | boolean | -      | false             |
| startDate           |             | string  | -      | ''                |
| endDate             |             | string  | -      | ''                |

## Events

| Event name        | Properties | Description |
| ----------------- | ---------- | ----------- |
| row-click         |            |
| page-change       |            |
| sort-change       |            |
| page-size-change  |            |
| search-change     |            |
| date-range-change |            |

---
