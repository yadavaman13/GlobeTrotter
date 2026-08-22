# FilterTable

A composite data table equipped with an integrated top filter pill bar and search inputs for immediate multi-criteria dataset querying.

---

## 1. Import Path

```javascript
import FilterTable from '@/components/Shared/DataDisplay/FilterTable/FilterTable';
```

---

## 2. Props Specification

| Prop Name        | Type                                                            | Default | Required | Description                               |
| ---------------- | --------------------------------------------------------------- | ------- | -------- | ----------------------------------------- |
| `data`           | `Array<object>`                                                 | `[]`    | Yes      | Records array.                            |
| `columns`        | `Array<ColumnConfig>`                                           | `[]`    | Yes      | Column layout schema.                     |
| `filters`        | `Array<{ key: string, label: string, options: Array<string> }>` | `[]`    | No       | Predefined category filter pills.         |
| `onFilterChange` | `function`                                                      | —       | No       | Callback when active filter chips change. |

---

## 3. Usage Example

```jsx
import FilterTable from '@/components/Shared/DataDisplay/FilterTable/FilterTable';

export default function LeadsFilterTableView({ leads }) {
    const columns = [
        { key: 'name', label: 'Lead' },
        { key: 'source', label: 'Channel' },
        { key: 'status', label: 'Status' },
    ];

    const filters = [
        {
            key: 'status',
            label: 'Status',
            options: ['New', 'Contacted', 'Qualified'],
        },
    ];

    return <FilterTable data={leads} columns={columns} filters={filters} />;
}
```
