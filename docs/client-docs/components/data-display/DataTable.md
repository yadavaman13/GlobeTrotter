# DataTable

A lightweight data table primitive suited for standard tabular grids with sortable column headers, pagination controls, and row hover highlights.

---

## 1. Import Path

```javascript
import DataTable from "@/components/Shared/DataDisplay/DataTable/DataTable";
```

---

## 2. Props Specification

| Prop Name    | Type                                                                           | Default | Required | Description                          |
| ------------ | ------------------------------------------------------------------------------ | ------- | -------- | ------------------------------------ |
| `data`       | `Array<object>`                                                                | `[]`    | Yes      | List of row record objects.          |
| `columns`    | `Array<{ key: string, label: string, sortable?: boolean, render?: function }>` | `[]`    | Yes      | Column layout schema.                |
| `loading`    | `boolean`                                                                      | `false` | No       | Shows loading skeleton placeholders. |
| `pageSize`   | `number`                                                                       | `10`    | No       | Number of rows per page.             |
| `onRowClick` | `function`                                                                     | —       | No       | Row click callback: `(row) => void`. |
| `className`  | `string`                                                                       | `''`    | No       | Custom CSS class name.               |

---

## 3. Usage Example

```jsx
import DataTable from "@/components/Shared/DataDisplay/DataTable/DataTable";

export default function SimpleUsersTable({ users, loading }) {
  const columns = [
    { key: "name", label: "Full Name", sortable: true },
    { key: "email", label: "Email Address" },
    { key: "role", label: "Role", sortable: true },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      loading={loading}
      pageSize={10}
      onRowClick={(user) => console.log("Selected user:", user)}
    />
  );
}
```
