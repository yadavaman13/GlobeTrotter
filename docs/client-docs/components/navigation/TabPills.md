# TabPills

A capsule/pill-styled tab selector component used for view filtering and section switching.

---

## 1. Import Path

```javascript
import TabPills from '@/components/Shared/Navigation/TabPills/TabPills';
```

---

## 2. Props Specification

| Prop Name     | Type                                   | Default | Required | Description          |
| ------------- | -------------------------------------- | ------- | -------- | -------------------- |
| `tabs`        | `Array<{ id: string, label: string }>` | `[]`    | Yes      | List of tab options. |
| `activeTab`   | `string`                               | —       | Yes      | Active tab ID.       |
| `onTabChange` | `function`                             | —       | Yes      | Tab change callback. |

---

## 3. Usage Example

```jsx
import { useState } from 'react';
import TabPills from '@/components/Shared/Navigation/TabPills/TabPills';

export default function PeriodFilter() {
    const [period, setPeriod] = useState('month');

    return (
        <TabPills
            tabs={[
                { id: 'day', label: 'Daily' },
                { id: 'week', label: 'Weekly' },
                { id: 'month', label: 'Monthly' },
            ]}
            activeTab={period}
            onTabChange={setPeriod}
        />
    );
}
```
