# Popover

A trigger-anchored popup container component for context overlays, quick previews, and interactive dropdown cards.

---

## 1. Import Path

```javascript
import Popover from '@/components/Shared/Feedback/Popover/Popover';
```

---

## 2. Props Specification

| Prop Name  | Type                                     | Default    | Required | Description                        |
| ---------- | ---------------------------------------- | ---------- | -------- | ---------------------------------- |
| `trigger`  | `ReactNode`                              | —          | Yes      | Element triggering the popover.    |
| `children` | `ReactNode`                              | —          | Yes      | Content inside the popover bubble. |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | No       | Alignment placement.               |

---

## 3. Usage Example

```jsx
import Popover from '@/components/Shared/Feedback/Popover/Popover';
import Button from '@/components/Shared/Buttons/Button/Button';

export default function QuickHelpPopover() {
    return (
        <Popover
            trigger={
                <Button size="sm" variant="ghost">
                    Help
                </Button>
            }
        >
            <div style={{ padding: '12px', maxWidth: '240px' }}>
                <p>Press Ctrl+K to open global command search at any time.</p>
            </div>
        </Popover>
    );
}
```
