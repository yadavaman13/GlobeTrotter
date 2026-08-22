# EmptyState

A visual fallback component for empty lists, search misses, and zero-data states, featuring an icon/illustration, descriptive text, and a call-to-action button.

---

## 1. Import Path

```javascript
import EmptyState from "@/components/Shared/DataDisplay/EmptyState/EmptyState";
```

---

## 2. Props Specification

| Prop Name     | Type        | Default           | Required | Description                          |
| ------------- | ----------- | ----------------- | -------- | ------------------------------------ |
| `title`       | `string`    | `'No data found'` | No       | Empty state heading.                 |
| `description` | `string`    | —                 | No       | Explanatory message.                 |
| `icon`        | `Component` | —                 | No       | Lucide React icon component.         |
| `actionText`  | `string`    | —                 | No       | CTA button label text.               |
| `onAction`    | `function`  | —                 | No       | Callback when CTA button is clicked. |

---

## 3. Usage Example

```jsx
import EmptyState from "@/components/Shared/DataDisplay/EmptyState/EmptyState";
import { UserPlus } from "lucide-react";

export default function NoLeadsView({ onCreateLead }) {
  return (
    <EmptyState
      title="No leads yet"
      description="Start building your sales pipeline by adding your first lead."
      icon={UserPlus}
      actionText="Create Lead"
      onAction={onCreateLead}
    />
  );
}
```
