# Command

A keyboard-accessible command palette search list component used for quick navigation, search suggestions, and action shortcuts.

---

## 1. Import Path

```javascript
import Command from '@/components/Shared/Form/Command/Command';
```

---

## 2. Props Specification

| Prop Name     | Type                                                                                            | Default                         | Required | Description                         |
| ------------- | ----------------------------------------------------------------------------------------------- | ------------------------------- | -------- | ----------------------------------- |
| `placeholder` | `string`                                                                                        | `'Type a command or search...'` | No       | Search input placeholder.           |
| `items`       | `Array<{ id: string, label: string, category?: string, icon?: Component, onSelect: function }>` | `[]`                            | Yes      | List of searchable command items.   |
| `onClose`     | `function`                                                                                      | —                               | No       | Callback when palette is dismissed. |
| `className`   | `string`                                                                                        | `''`                            | No       | Additional custom CSS class name.   |

---

## 3. Usage Example

```jsx
import Command from '@/components/Shared/Form/Command/Command';
import { useNavigate } from 'react-router';
import { LayoutDashboard, Users, MessageSquare } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose }) {
    const navigate = useNavigate();

    const commands = [
        {
            id: '1',
            label: 'Go to Dashboard',
            icon: LayoutDashboard,
            onSelect: () => navigate('/dashboard'),
        },
        {
            id: '2',
            label: 'Manage Leads',
            icon: Users,
            onSelect: () => navigate('/dashboard/leads'),
        },
        {
            id: '3',
            label: 'Open AI Copilot',
            icon: MessageSquare,
            onSelect: () => navigate('/dashboard/user/ai'),
        },
    ];

    if (!isOpen) return null;

    return <Command items={commands} onClose={onClose} />;
}
```
