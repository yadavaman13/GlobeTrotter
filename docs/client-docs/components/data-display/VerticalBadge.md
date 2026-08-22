# VerticalBadge

A vertical status indicator stripe component used along card edges, table rows, and alert sidebars.

---

## 1. Import Path

```javascript
import VerticalBadge from "@/components/Shared/DataDisplay/VerticalBadge/VerticalBadge";
```

---

## 2. Props Specification

| Prop Name   | Type                                                        | Default     | Required | Description            |
| ----------- | ----------------------------------------------------------- | ----------- | -------- | ---------------------- |
| `variant`   | `'success' \| 'danger' \| 'warning' \| 'info' \| 'primary'` | `'primary'` | No       | Status color variant.  |
| `className` | `string`                                                    | `''`        | No       | Custom CSS class name. |

---

## 3. Usage Example

```jsx
import VerticalBadge from "@/components/Shared/DataDisplay/VerticalBadge/VerticalBadge";

export default function PriorityCard({ priority, children }) {
  const variantMap = { high: "danger", medium: "warning", low: "info" };
  return (
    <div className="priority-card" style={{ display: "flex" }}>
      <VerticalBadge variant={variantMap[priority]} />
      <div className="card-content">{children}</div>
    </div>
  );
}
```
