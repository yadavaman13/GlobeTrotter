# Drawer

A slide-in side drawer panel primitive designed for detail views, record editors, and mobile navigation overlays.

---

## 1. Import Path

```javascript
import Drawer from '@/components/Shared/Feedback/Drawer/Drawer';
```

---

## 2. Props Specification

| Prop Name   | Type                                     | Default   | Required | Description                              |
| ----------- | ---------------------------------------- | --------- | -------- | ---------------------------------------- |
| `isOpen`    | `boolean`                                | `false`   | Yes      | Controls drawer open/closed state.       |
| `onClose`   | `function`                               | —         | Yes      | Callback to close the drawer.            |
| `title`     | `string`                                 | —         | No       | Drawer header title.                     |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | No       | Screen edge from which drawer slides in. |
| `children`  | `ReactNode`                              | —         | Yes      | Drawer body content.                     |
| `width`     | `string`                                 | `'420px'` | No       | Custom width for left/right placements.  |

---

## 3. Usage Example

```jsx
import Drawer from '@/components/Shared/Feedback/Drawer/Drawer';

export default function LeadDetailDrawer({ isOpen, onClose, lead }) {
    return (
        <Drawer isOpen={isOpen} onClose={onClose} title="Lead Overview" placement="right">
            <div>
                <h3>{lead?.name}</h3>
                <p>Company: {lead?.company}</p>
            </div>
        </Drawer>
    );
}
```
