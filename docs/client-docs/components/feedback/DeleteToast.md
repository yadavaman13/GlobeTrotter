# DeleteToast

A specialized confirmation toast component for destructive operations, featuring an "Undo" action and a countdown progress bar.

---

## 1. Import Path

```javascript
import DeleteToast from "@/components/Shared/Feedback/DeleteToast/DeleteToast";
```

---

## 2. Props Specification

| Prop Name   | Type       | Default          | Required | Description                                  |
| ----------- | ---------- | ---------------- | -------- | -------------------------------------------- |
| `message`   | `string`   | `'Item deleted'` | No       | Toast notification message.                  |
| `onUndo`    | `function` | —                | No       | Callback fired if user clicks "Undo".        |
| `onDismiss` | `function` | —                | Yes      | Callback fired when toast expires or closes. |
| `duration`  | `number`   | `4000`           | No       | Display duration in milliseconds.            |

---

## 3. Usage Example

```jsx
import DeleteToast from "@/components/Shared/Feedback/DeleteToast/DeleteToast";

export default function DeleteAction({
  isDeleted,
  handleUndoDelete,
  handleCloseToast,
}) {
  if (!isDeleted) return null;

  return (
    <DeleteToast
      message="Lead deleted successfully"
      onUndo={handleUndoDelete}
      onDismiss={handleCloseToast}
    />
  );
}
```
