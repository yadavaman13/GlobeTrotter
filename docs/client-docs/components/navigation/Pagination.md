# Pagination

A complete page navigation control component supporting page numbering, next/previous buttons, and a rows-per-page size dropdown.

---

## 1. Import Path

```javascript
import Pagination from '@/components/Shared/Navigation/Pagination/Pagination';
```

---

## 2. Props Specification

| Prop Name             | Type            | Default           | Required | Description                                     |
| --------------------- | --------------- | ----------------- | -------- | ----------------------------------------------- |
| `currentPage`         | `number`        | `1`               | Yes      | 1-indexed active page number.                   |
| `totalPages`          | `number`        | `1`               | Yes      | Total calculated page count.                    |
| `onPageChange`        | `function`      | —                 | Yes      | Page change callback: `(page: number) => void`. |
| `rowsPerPage`         | `number`        | `10`              | No       | Current rows per page.                          |
| `onRowsPerPageChange` | `function`      | —                 | No       | Callback when page size dropdown changes.       |
| `rowsOptions`         | `Array<number>` | `[5, 10, 20, 50]` | No       | Available page size choices.                    |

---

## 3. Usage Example

```jsx
import Pagination from '@/components/Shared/Navigation/Pagination/Pagination';

export default function TablePaginationFooter({
    page,
    totalPages,
    setPage,
    pageSize,
    setPageSize,
}) {
    return (
        <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={setPageSize}
        />
    );
}
```
