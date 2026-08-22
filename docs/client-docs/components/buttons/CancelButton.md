# CancelButton

A pre-styled secondary button used for cancelling modal flows, form changes, and wizard steps without triggering destructive state.

---

## 1. Import Path

```javascript
import CancelButton from '@/components/Shared/Buttons/CancelButton/CancelButton';
```

---

## 2. Props Specification

| Prop Name   | Type                   | Default    | Required | Description                       |
| ----------- | ---------------------- | ---------- | -------- | --------------------------------- |
| `children`  | `ReactNode`            | `'Cancel'` | No       | Button label text.                |
| `onClick`   | `function`             | —          | Yes      | Click event handler callback.     |
| `disabled`  | `boolean`              | `false`    | No       | Disables user interaction.        |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`     | No       | Button size preset.               |
| `className` | `string`               | `''`       | No       | Additional custom CSS class name. |

---

## 3. Usage Example

```jsx
import CancelButton from '@/components/Shared/Buttons/CancelButton/CancelButton';
import SaveDetailsButton from '@/components/Shared/Buttons/SaveDetailsButton/SaveDetailsButton';

export default function ModalActions({ onClose, onSave }) {
    return (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <CancelButton onClick={onClose} />
            <SaveDetailsButton onClick={onSave}>Save Changes</SaveDetailsButton>
        </div>
    );
}
```
