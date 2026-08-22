# IconButton

A compact, accessible icon-only button container supporting circular or rounded-square variants, tooltips, and neutral hover highlights.

---

## 1. Import Path

```javascript
import IconButton from "@/components/Shared/Buttons/IconButton/IconButton";
```

---

## 2. Props Specification

| Prop Name   | Type                                            | Default     | Required | Description                                       |
| ----------- | ----------------------------------------------- | ----------- | -------- | ------------------------------------------------- |
| `children`  | `ReactNode`                                     | —           | Yes      | Icon element (e.g. Lucide React icon).            |
| `onClick`   | `function`                                      | —           | No       | Click event handler callback.                     |
| `variant`   | `'default' \| 'ghost' \| 'danger' \| 'primary'` | `'default'` | No       | Visual theme styling.                             |
| `size`      | `'sm' \| 'md' \| 'lg'`                          | `'md'`      | No       | Dimensions preset (32px, 40px, 48px).             |
| `shape`     | `'circle' \| 'square' \| 'rounded'`             | `'rounded'` | No       | Corner geometry format.                           |
| `ariaLabel` | `string`                                        | —           | Yes      | Screen reader label for accessibility compliance. |
| `disabled`  | `boolean`                                       | `false`     | No       | Disables button interactions.                     |
| `className` | `string`                                        | `''`        | No       | Additional custom CSS class name.                 |

---

## 3. Usage Example

```jsx
import IconButton from "@/components/Shared/Buttons/IconButton/IconButton";
import { Settings, Bell } from "lucide-react";

export default function HeaderActions() {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <IconButton ariaLabel="Notifications" shape="circle" size="md">
        <Bell size={18} />
      </IconButton>
      <IconButton ariaLabel="Settings" shape="circle" size="md">
        <Settings size={18} />
      </IconButton>
    </div>
  );
}
```
