# ClearAllButton

A lightweight reset button with clear/refresh icon designed for resetting form inputs, search filters, and active tab selections.

---

## 1. Import Path

```javascript
import ClearAllButton from '@/components/Shared/Buttons/ClearAllButton/ClearAllButton';
```

---

## 2. Props Specification

| Prop Name   | Type        | Default       | Required | Description                                       |
| ----------- | ----------- | ------------- | -------- | ------------------------------------------------- |
| `onClick`   | `function`  | —             | Yes      | Callback triggered to clear filters or form data. |
| `children`  | `ReactNode` | `'Clear All'` | No       | Button label text.                                |
| `disabled`  | `boolean`   | `false`       | No       | Disables click triggers.                          |
| `className` | `string`    | `''`          | No       | Additional custom CSS class name.                 |

---

## 3. Usage Example

```jsx
import ClearAllButton from '@/components/Shared/Buttons/ClearAllButton/ClearAllButton';

export default function TableFilterBar({ onResetFilters }) {
    return (
        <div className="filter-bar">
            <span>Active Filters (3)</span>
            <ClearAllButton onClick={onResetFilters} />
        </div>
    );
}
```
