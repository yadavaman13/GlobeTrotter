# Toast

A floating system notification toast component supporting multiple status types (success, error, warning, info), auto-dismiss timers, and close actions.

---

## 1. Import Path

```javascript
import Toast from '@/components/Shared/Feedback/Toast/Toast';
```

---

## 2. Props Specification

| Prop Name  | Type                                          | Default  | Required | Description                                           |
| ---------- | --------------------------------------------- | -------- | -------- | ----------------------------------------------------- |
| `message`  | `string`                                      | —        | Yes      | Main toast message text.                              |
| `type`     | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | No       | Status theme color & icon.                            |
| `onClose`  | `function`                                    | —        | Yes      | Callback fired upon dismissal.                        |
| `duration` | `number`                                      | `3000`   | No       | Auto-dismiss duration in milliseconds (0 to disable). |

---

## 3. Usage Example

```jsx
import Toast from '@/components/Shared/Feedback/Toast/Toast';

export default function NotificationToast({ toast, setToast }) {
    if (!toast) return null;

    return <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />;
}
```
