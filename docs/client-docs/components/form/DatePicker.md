# DatePicker

A custom date input selector supporting `DD-MM-YYYY` Indian/international date formatting, a calendar popover, quick 'Today' selection, clear action, and error highlights.

---

## 1. Import Path

```javascript
import DatePicker from '@/components/Shared/Form/DatePicker/DatePicker';
```

---

## 2. Props Specification

| Prop Name     | Type             | Default         | Required | Description                                               |
| ------------- | ---------------- | --------------- | -------- | --------------------------------------------------------- |
| `label`       | `string`         | —               | No       | Label rendered above date input.                          |
| `value`       | `string \| Date` | —               | No       | Selected date value (e.g. `'YYYY-MM-DD'` or Date object). |
| `onChange`    | `function`       | —               | Yes      | Date selection callback: `(date: string) => void`.        |
| `placeholder` | `string`         | `'Select Date'` | No       | Input placeholder string.                                 |
| `minDate`     | `string \| Date` | —               | No       | Minimum selectable date constraint.                       |
| `maxDate`     | `string \| Date` | —               | No       | Maximum selectable date constraint.                       |
| `error`       | `string`         | —               | No       | Validation error message.                                 |
| `disabled`    | `boolean`        | `false`         | No       | Disables input interaction.                               |

---

## 3. Usage Example

```jsx
import { useState } from 'react';
import DatePicker from '@/components/Shared/Form/DatePicker/DatePicker';

export default function InvoiceFilter() {
    const [dueDate, setDueDate] = useState('');

    return (
        <DatePicker
            label="Invoice Due Date"
            value={dueDate}
            onChange={setDueDate}
            placeholder="DD-MM-YYYY"
        />
    );
}
```
