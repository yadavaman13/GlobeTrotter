# DeleteButton

A destructive action button pre-styled with danger colors (`$color-danger`), an integrated trash icon, and hover confirmation states.

---

## 1. Import Path

```javascript
import DeleteButton from "@/components/Shared/Buttons/DeleteButton/DeleteButton";
```

---

## 2. Props Specification

| Prop Name   | Type                   | Default    | Required | Description                                |
| ----------- | ---------------------- | ---------- | -------- | ------------------------------------------ |
| `onClick`   | `function`             | —          | Yes      | Callback function triggered upon deletion. |
| `children`  | `ReactNode`            | `'Delete'` | No       | Button label text.                         |
| `disabled`  | `boolean`              | `false`    | No       | Disables the button.                       |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`     | No       | Size preset.                               |
| `className` | `string`               | `''`       | No       | Additional custom CSS class name.          |

---

## 3. Usage Example

```jsx
import DeleteButton from "@/components/Shared/Buttons/DeleteButton/DeleteButton";

export default function LeadRowActions({ leadId, onDeleteLead }) {
  return (
    <DeleteButton size="sm" onClick={() => onDeleteLead(leadId)}>
      Remove
    </DeleteButton>
  );
}
```
