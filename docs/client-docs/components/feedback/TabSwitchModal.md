# TabSwitchModal

A confirmation modal dialog that prompts users when they attempt to navigate away from a view or form with unsaved changes.

---

## 1. Import Path

```javascript
import TabSwitchModal from "@/components/Shared/Feedback/TabSwitchModal/TabSwitchModal";
```

---

## 2. Props Specification

| Prop Name   | Type       | Default             | Required | Description                                                    |
| ----------- | ---------- | ------------------- | -------- | -------------------------------------------------------------- |
| `isOpen`    | `boolean`  | `false`             | Yes      | Controls modal open/closed state.                              |
| `onConfirm` | `function` | —                   | Yes      | Callback fired when user confirms discarding changes.          |
| `onCancel`  | `function` | —                   | Yes      | Callback fired when user chooses to stay and continue editing. |
| `title`     | `string`   | `'Unsaved Changes'` | No       | Modal title.                                                   |

---

## 3. Usage Example

```jsx
import TabSwitchModal from "@/components/Shared/Feedback/TabSwitchModal/TabSwitchModal";

export default function DirtyFormGuard({
  isDirty,
  showModal,
  handleLeave,
  handleStay,
}) {
  return (
    <TabSwitchModal
      isOpen={showModal}
      onConfirm={handleLeave}
      onCancel={handleStay}
    />
  );
}
```
