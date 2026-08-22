# Tooltip

An accessible hover and focus popover tooltip primitive with directional positioning, arrow pointers, and zero-flicker transitions.

---

## 1. Import Path

```javascript
import Tooltip from '@/components/Shared/DataDisplay/Tooltip/Tooltip';
```

---

## 2. Props Specification

| Prop Name   | Type                                     | Default | Required | Description                                   |
| ----------- | ---------------------------------------- | ------- | -------- | --------------------------------------------- |
| `content`   | `ReactNode \| string`                    | —       | Yes      | Text or JSX rendered inside tooltip popup.    |
| `children`  | `ReactNode`                              | —       | Yes      | Target anchor element triggering the tooltip. |
| `position`  | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | No       | Alignment position relative to target.        |
| `delay`     | `number`                                 | `150`   | No       | Hover reveal delay in milliseconds.           |
| `className` | `string`                                 | `''`    | No       | Additional custom CSS class name.             |

---

## 3. Usage Example

```jsx
import Tooltip from '@/components/Shared/DataDisplay/Tooltip/Tooltip';
import IconButton from '@/components/Shared/Buttons/IconButton/IconButton';
import { HelpCircle } from 'lucide-react';

export default function HelpTip() {
    return (
        <Tooltip
            content="Calculated by averaging closed lead amounts over the last 30 days"
            position="top"
        >
            <IconButton ariaLabel="Help Info" size="sm" variant="ghost">
                <HelpCircle size={16} />
            </IconButton>
        </Tooltip>
    );
}
```
