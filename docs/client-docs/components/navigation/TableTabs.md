# TableTabs

A horizontal filter tab bar component with pill counts, active tab underlines, and optional trailing header action slots.

---

## 1. Import Path

```javascript
import TableTabs from "@/components/Shared/Navigation/TableTabs/TableTabs";
```

---

## 2. Props Specification

| Prop Name     | Type                                                   | Default | Required | Description                                                        |
| ------------- | ------------------------------------------------------ | ------- | -------- | ------------------------------------------------------------------ |
| `tabs`        | `Array<{ id: string, label: string, count?: number }>` | `[]`    | Yes      | Tab definitions with optional badge counts.                        |
| `activeTab`   | `string`                                               | —       | Yes      | Currently selected tab ID.                                         |
| `onTabChange` | `function`                                             | —       | Yes      | Callback: `(tabId: string) => void`.                               |
| `actions`     | `ReactNode`                                            | —       | No       | Optional right-aligned action elements (e.g. Export / New button). |

---

## 3. Usage Example

```jsx
import { useState } from "react";
import TableTabs from "@/components/Shared/Navigation/TableTabs/TableTabs";
import Button from "@/components/Shared/Buttons/Button/Button";

export default function LeadTabs({ onNewLead }) {
  const [active, setActive] = useState("all");

  const tabs = [
    { id: "all", label: "All Leads", count: 124 },
    { id: "new", label: "New", count: 18 },
    { id: "contacted", label: "Contacted", count: 42 },
  ];

  return (
    <TableTabs
      tabs={tabs}
      activeTab={active}
      onTabChange={setActive}
      actions={
        <Button size="sm" onClick={onNewLead}>
          + New Lead
        </Button>
      }
    />
  );
}
```
