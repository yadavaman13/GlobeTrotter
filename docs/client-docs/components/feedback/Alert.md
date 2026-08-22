# Alert

An inline status banner component for prominent warnings, success notifications, error alerts, and informational updates.

---

## 1. Import Path

```javascript
import Alert from "@/components/Shared/Feedback/Alert/Alert";
```

---

## 2. Props Specification

| Prop Name  | Type                                          | Default  | Required | Description                |
| ---------- | --------------------------------------------- | -------- | -------- | -------------------------- |
| `type`     | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | No       | Status theme styling.      |
| `title`    | `string`                                      | —        | No       | Alert bold title text.     |
| `children` | `ReactNode`                                   | —        | Yes      | Alert description message. |
| `onClose`  | `function`                                    | —        | No       | Optional dismiss callback. |

---

## 3. Usage Example

```jsx
import Alert from "@/components/Shared/Feedback/Alert/Alert";

export default function MaintenanceBanner() {
  return (
    <Alert type="warning" title="Scheduled Maintenance">
      Database indexing is scheduled for tonight at 2:00 AM UTC.
    </Alert>
  );
}
```
