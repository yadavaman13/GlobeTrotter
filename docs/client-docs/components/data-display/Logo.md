# Logo

The central application branding logo component supporting full, compact, icon-only, and light/dark theme variants.

---

## 1. Import Path

```javascript
import Logo from '@/components/Shared/DataDisplay/Logo/Logo';
```

---

## 2. Props Specification

| Prop Name   | Type                            | Default  | Required | Description                |
| ----------- | ------------------------------- | -------- | -------- | -------------------------- |
| `variant`   | `'full' \| 'icon' \| 'compact'` | `'full'` | No       | Visual layout mode.        |
| `size`      | `'sm' \| 'md' \| 'lg'`          | `'md'`   | No       | Dimensions scaling preset. |
| `className` | `string`                        | `''`     | No       | Custom CSS class name.     |

---

## 3. Usage Example

```jsx
import Logo from '@/components/Shared/DataDisplay/Logo/Logo';

export default function AppHeader() {
    return <Logo variant="full" size="md" />;
}
```
