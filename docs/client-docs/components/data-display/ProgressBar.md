# ProgressBar

A linear percentage progress bar component with animated filling transitions, percentage labels, and status color variants.

---

## 1. Import Path

```javascript
import ProgressBar from "@/components/Shared/DataDisplay/ProgressBar/ProgressBar";
```

---

## 2. Props Specification

| Prop Name   | Type                                              | Default     | Required | Description                                 |
| ----------- | ------------------------------------------------- | ----------- | -------- | ------------------------------------------- |
| `value`     | `number`                                          | `0`         | Yes      | Current progress percentage (0 - 100).      |
| `variant`   | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | No       | Color theme variant.                        |
| `showLabel` | `boolean`                                         | `false`     | No       | Renders percentage value text (e.g. `75%`). |
| `height`    | `string`                                          | `'8px'`     | No       | Height of the progress bar track.           |

---

## 3. Usage Example

```jsx
import ProgressBar from "@/components/Shared/DataDisplay/ProgressBar/ProgressBar";

export default function StorageUsage({ percentUsed }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <span>Storage Limit</span>
        <span>{percentUsed}%</span>
      </div>
      <ProgressBar
        value={percentUsed}
        variant={percentUsed > 85 ? "danger" : "primary"}
      />
    </div>
  );
}
```
