# AdvancedTable

A high-performance enterprise data table component designed with a **minimal-by-default architecture**. Out of the box, `<AdvancedTable columns={columns} data={data} />` renders a clean, lightweight, distraction-free table. Advanced capabilities (Search bar, Filter panel, Sort-by dropdown, View switcher, Column manager, Checkbox selection, Export menu, Refresh button, Context menu, Serial numbers, etc.) are exposed as modular boolean flags (`false` by default) so you can customize from minimal tables to complete enterprise workbenches.

---

## 1. Import Path

```javascript
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
```

---

## 2. Props Specification

### Data & Column Props

| Prop Name            | Type                  | Default | Required | Description                                                            |
| :------------------- | :-------------------- | :------ | :------- | :--------------------------------------------------------------------- |
| `data`               | `Array<object>`       | `[]`    | Yes      | Array of record objects.                                               |
| `columns`            | `Array<ColumnConfig>` | `[]`    | No       | Column definitions (auto-inferred from data if omitted).               |
| `loading`            | `boolean`             | `false` | No       | Displays skeleton loading rows.                                        |
| `skeletonRows`       | `number`              | `null`  | No       | Explicit skeleton row count when loading.                              |
| `initialRowsPerPage` | `number`              | `5`     | No       | Initial pagination page size.                                          |
| `serverSide`         | `boolean`             | `false` | No       | Enables server-side search, sort, and pagination delegation.           |
| `totalCount`         | `number`              | `null`  | No       | Total record count for server-side pagination.                         |
| `onTableChange`      | `function`            | `null`  | No       | Callback on page/sort/search/tab change: `(state) => void`.            |
| `onDataChange`       | `function`            | `null`  | No       | Fired when rows are edited inline or deleted: `(updatedData) => void`. |

### Modular Boolean Feature Flags (Minimal by Default)

| Prop Name                                | Type      | Default | Description                                                                                                               |
| :--------------------------------------- | :-------- | :------ | :------------------------------------------------------------------------------------------------------------------------ |
| `showSerialNumber`                       | `boolean` | `false` | Displays a compact `#` column with continuous page-aware numbering (`(page - 1) * perPage + index + 1`).                  |
| `showSortDropdown`                       | `boolean` | `false` | Renders the "Sort by" dropdown beside the filter button with directional options (`A → Z`, `High → Low`, `Newest first`). |
| `showColumnSorting`                      | `boolean` | `false` | Allows clicking column headers directly to toggle ascending/descending/reset sorting.                                     |
| `showFilter` / `filterable`              | `boolean` | `false` | Shows the Filter button, active filter badge, and accordion filter panel (multi-select, date range, numeric range).       |
| `searchable`                             | `boolean` | `false` | Shows the animated search bar with dynamic placeholder cycling.                                                           |
| `showColumnToggle` / `showManageColumns` | `boolean` | `false` | Shows the "Manage Columns" / column visibility and collapse dropdown.                                                     |
| `enableColumnReorder`                    | `boolean` | `false` | Allows drag-and-drop column reordering.                                                                                   |
| `selectable`                             | `boolean` | `false` | Enables row checkboxes, select-all, and floating bulk action bar (edit, delete, export).                                  |
| `showRefresh`                            | `boolean` | `false` | Shows the table refresh trigger button with spinning animation.                                                           |
| `showExport`                             | `boolean` | `false` | Shows CSV / Excel / PDF export dropdown menu.                                                                             |
| `showRowsPerPage`                        | `boolean` | `false` | Shows the "Rows per page" / "Cards per page" dropdown selector.                                                           |
| `showResultsCount`                       | `boolean` | `false` | Shows "Showing X–Y of Z results" text.                                                                                    |
| `showPagination`                         | `boolean` | `true`  | Shows bottom pagination controls when data exceeds `initialRowsPerPage`.                                                  |
| `showTabs`                               | `boolean` | `null`  | Shows status/category filter tabs bar (auto-detected when `tabs` array is passed).                                        |
| `showViewToggle`                         | `boolean` | `false` | Displays the Table / Grid card view switcher segmented button in the header actions.                                      |
| `enableContextMenu`                      | `boolean` | `false` | Enables right-click context menu on cells for quick copy & options.                                                       |
| `showScrollButtons`                      | `boolean` | `false` | Shows left/right scroll navigation buttons when table overflows.                                                          |

### Grid View & Card Props (When `viewMode="grid"` or `showViewToggle={true}`)

| Prop Name          | Type                | Default   | Description                                                                                |
| :----------------- | :------------------ | :-------- | :----------------------------------------------------------------------------------------- |
| `viewMode`         | `'table' \| 'grid'` | `null`    | Controlled active view mode.                                                               |
| `defaultViewMode`  | `'table' \| 'grid'` | `'table'` | Initial view mode if uncontrolled.                                                         |
| `onViewModeChange` | `function`          | `null`    | Callback when user toggles view mode: `(newView) => void`.                                 |
| `gridColumns`      | `number`            | `4`       | Number of columns in responsive card grid (e.g. 2, 3, 4).                                  |
| `cardTitleKey`     | `string`            | —         | Field key used for GridCard main title.                                                    |
| `cardSubtitleKey`  | `string`            | —         | Field key used for GridCard subtitle.                                                      |
| `cardImageKey`     | `string`            | —         | Field key with avatar/image URL.                                                           |
| `cardStatusKey`    | `string`            | —         | Field key rendered as a status Badge pill.                                                 |
| `cardBodyKeys`     | `Array<string>`     | `[]`      | Array of field keys rendered as label:value rows in the card body.                         |
| `statusVariantMap` | `object`            | `{}`      | Map of status strings to Badge variants, e.g. `{ Active: 'success', Pending: 'warning' }`. |
| `onCardClick`      | `function`          | `null`    | Click handler when clicking anywhere on a card: `(row) => void`.                           |
| `renderCard`       | `function`          | `null`    | Complete custom card render override: `(row, columns) => JSX`.                             |

---

## 3. Column Configuration Schema (`ColumnConfig`)

```typescript
interface ColumnConfig {
    key: string; // Field property key in row object
    label: string; // Column header title
    sortable?: boolean; // Controls if column is sortable
    collapsible?: boolean; // Controls if column can be collapsed/hidden
    width?: string; // Fixed or min width (e.g. '180px', '220px')
    type?: 'text' | 'numeric' | 'date' | 'badge';
    render?: (value: any, row: object) => ReactNode; // Custom cell renderer
}
```

---

## 4. Usage Examples

### A. Minimal Table (Clean & Basic)

```jsx
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
];

export default function BasicEmployeeTable({ employees }) {
    return <AdvancedTable columns={columns} data={employees} />;
}
```

### B. Enterprise Power Table (All Features Enabled)

```jsx
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';

const columns = [
    { key: 'employeeId', label: 'Employee ID', sortable: true },
    { key: 'name', label: 'Full Name', sortable: true },
    { key: 'role', label: 'Designation', sortable: true },
    {
        key: 'salary',
        label: 'Monthly CTC',
        sortable: true,
        render: (val) => `₹${Number(val).toLocaleString()}`,
    },
    {
        key: 'status',
        label: 'Status',
        render: (val) => (
            <Badge variant={val === 'Active' ? 'success' : val === 'Leave' ? 'warning' : 'danger'}>
                {val}
            </Badge>
        ),
    },
];

export default function EmployeeWorkbench({ employees, isLoading, onRefresh }) {
    return (
        <AdvancedTable
            columns={columns}
            data={employees}
            loading={isLoading}
            tabFilterKey="status"
            showSerialNumber={true}
            showSortDropdown={true}
            showColumnSorting={true}
            showColumnToggle={true}
            showFilter={true}
            searchable={true}
            searchPlaceholder="Search employees..."
            initialRowsPerPage={10}
            selectable={true}
            showRefresh={true}
            showExport={true}
            showRowsPerPage={true}
            showResultsCount={true}
            showViewToggle={true}
            gridColumns={4}
            cardTitleKey="name"
            cardSubtitleKey="role"
            cardStatusKey="status"
            cardBodyKeys={['salary', 'employeeId']}
            onRefresh={onRefresh}
        />
    );
}
```
