# EditButton

A pre-styled secondary action button featuring an edit pencil icon used for inline editing of tables, cards, and profile sections.

---

## 1. Import Path

```javascript
import EditButton from "@/components/Shared/Buttons/EditButton/EditButton";
```

---

## 2. Props Specification

| Prop Name   | Type                   | Default  | Required | Description                       |
| ----------- | ---------------------- | -------- | -------- | --------------------------------- |
| `onClick`   | `function`             | —        | Yes      | Edit trigger callback.            |
| `children`  | `ReactNode`            | `'Edit'` | No       | Button label text.                |
| `disabled`  | `boolean`              | `false`  | No       | Disables click triggers.          |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`   | No       | Size preset.                      |
| `className` | `string`               | `''`     | No       | Additional custom CSS class name. |

---

## 3. Usage Example

```jsx
import EditButton from "@/components/Shared/Buttons/EditButton/EditButton";

export default function UserCard({ user, onEdit }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <EditButton size="sm" onClick={() => onEdit(user)}>
        Edit Profile
      </EditButton>
    </div>
  );
}
```
