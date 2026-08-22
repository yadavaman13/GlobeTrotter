# KanbanBoard

An interactive drag-and-drop task status board component for managing CRM pipeline stages, lead qualifications, and project workflows.

---

## 1. Import Path

```javascript
import KanbanBoard from "@/components/Shared/DataDisplay/KanbanBoard/KanbanBoard";
```

---

## 2. Props Specification

| Prop Name     | Type                                                   | Default | Required | Description                                                                                                    |
| ------------- | ------------------------------------------------------ | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `columns`     | `Array<{ id: string, title: string, count?: number }>` | `[]`    | Yes      | Stage column definitions.                                                                                      |
| `items`       | `Array<KanbanItem>`                                    | `[]`    | Yes      | Task/lead cards list.                                                                                          |
| `onItemMove`  | `function`                                             | —       | Yes      | Callback fired when a card is dropped into a new column: `(itemId, sourceColId, destColId, newIndex) => void`. |
| `onItemClick` | `function`                                             | —       | No       | Callback when a card is clicked.                                                                               |
| `loading`     | `boolean`                                              | `false` | No       | Shows skeleton placeholders.                                                                                   |

---

## 3. Usage Example

```jsx
import KanbanBoard from "@/components/Shared/DataDisplay/KanbanBoard/KanbanBoard";

const columns = [
  { id: "lead", title: "New Lead" },
  { id: "qualified", title: "Qualified" },
  { id: "proposal", title: "Proposal Sent" },
  { id: "won", title: "Closed Won" },
];

export default function PipelineKanban({
  deals,
  handleMoveDeal,
  handleSelectDeal,
}) {
  return (
    <KanbanBoard
      columns={columns}
      items={deals}
      onItemMove={handleMoveDeal}
      onItemClick={handleSelectDeal}
    />
  );
}
```
