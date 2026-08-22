# Badge

A compact status pill and counter badge primitive supporting semantic status variants (success, danger, warning, info, default, primary) and size options.

---

## 1. Import Path

```javascript
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
```

---

## 2. Props Specification

| Prop Name   | Type                                                                     | Default     | Required | Description                             |
| ----------- | ------------------------------------------------------------------------ | ----------- | -------- | --------------------------------------- |
| `children`  | `ReactNode`                                                              | —           | Yes      | Badge text or numeric count.            |
| `variant`   | `'success' \| 'danger' \| 'warning' \| 'info' \| 'primary' \| 'default'` | `'default'` | No       | Color theme variant.                    |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                   | `'md'`      | No       | Badge scale preset.                     |
| `dot`       | `boolean`                                                                | `false`     | No       | Renders a small status dot before text. |
| `className` | `string`                                                                 | `''`        | No       | Additional custom CSS class name.       |

---

## 3. Usage Example

```jsx
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';

export default function StatusBadges() {
    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Badge variant="success" dot>
                Active
            </Badge>
            <Badge variant="warning" dot>
                Pending
            </Badge>
            <Badge variant="danger" dot>
                Overdue
            </Badge>
            <Badge variant="info">Beta</Badge>
        </div>
    );
}
```
