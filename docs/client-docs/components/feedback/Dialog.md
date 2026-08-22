# Dialog

A modal dialog primitive with backdrop blur, focus trapping, smooth entry/exit animations, customizable headers, and action buttons.

---

## 1. Import Path

```javascript
import Dialog from "@/components/Shared/Feedback/Dialog/Dialog";
```

---

## 2. Props Specification

| Prop Name  | Type                           | Default | Required | Description                                                              |
| ---------- | ------------------------------ | ------- | -------- | ------------------------------------------------------------------------ |
| `isOpen`   | `boolean`                      | `false` | Yes      | Controls modal open/closed state.                                        |
| `onClose`  | `function`                     | —       | Yes      | Callback fired when dismissed (via backdrop, close icon, or Escape key). |
| `title`    | `string`                       | —       | No       | Modal header title text.                                                 |
| `children` | `ReactNode`                    | —       | Yes      | Modal body content.                                                      |
| `footer`   | `ReactNode`                    | —       | No       | Action buttons in modal footer.                                          |
| `size`     | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | No       | Dialog width preset.                                                     |

---

## 3. Usage Example

```jsx
import { useState } from "react";
import Dialog from "@/components/Shared/Feedback/Dialog/Dialog";
import Button from "@/components/Shared/Buttons/Button/Button";
import CancelButton from "@/components/Shared/Buttons/CancelButton/CancelButton";

export default function EditUserModal({ user, onSave }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Edit User</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit User Profile"
        footer={
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
          >
            <CancelButton onClick={() => setIsOpen(false)} />
            <Button variant="primary" onClick={onSave}>
              Save Changes
            </Button>
          </div>
        }
      >
        <p>Editing profile details for {user?.name}</p>
      </Dialog>
    </>
  );
}
```
