# ViewToggle

A segmented icon-button toggle control used for switching between Table view and Grid/Card view across data layouts.

> [!TIP]
> `AdvancedTable` has integrated `ViewToggle` support built-in via the `showViewToggle={true}` boolean prop, which automatically renders this toggle in the header actions bar and switches between Table and Grid card layouts without requiring manual wrapper state.

---

## 1. Import Path

```javascript
import ViewToggle from "@/components/Shared/Buttons/ViewToggle/ViewToggle";
```

---

## 2. Props Specification

| Prop Name      | Type                | Default   | Required | Description                                                                     |
| -------------- | ------------------- | --------- | -------- | ------------------------------------------------------------------------------- |
| `view`         | `'table' \| 'grid'` | `'table'` | Yes      | Active view mode.                                                               |
| `onViewChange` | `function`          | —         | Yes      | Callback fired when user switches view: `(newView: 'table' \| 'grid') => void`. |
| `size`         | `'sm' \| 'md'`      | `'md'`    | No       | Button dimensions preset.                                                       |
| `className`    | `string`            | `''`      | No       | Additional custom CSS class name.                                               |

---

## 3. Usage Examples

### A. Automatic Integration via AdvancedTable

```jsx
import AdvancedTable from "@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable";

export default function LeadsTable({ leads, columns }) {
  return (
    <AdvancedTable
      data={leads}
      columns={columns}
      showViewToggle={true}
      defaultViewMode="table"
      gridColumns={4}
      cardTitleKey="name"
      cardSubtitleKey="company"
      cardStatusKey="status"
    />
  );
}
```

### B. Standalone Usage

```jsx
import { useState } from "react";
import ViewToggle from "@/components/Shared/Buttons/ViewToggle/ViewToggle";

export default function CustomViewSwitcher() {
  const [viewMode, setViewMode] = useState("table");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span>Layout:</span>
      <ViewToggle view={viewMode} onViewChange={setViewMode} size="sm" />
    </div>
  );
}
```
