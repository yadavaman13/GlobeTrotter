# Calendar

A standalone, accessible monthly calendar grid widget supporting single-date selection, range highlights, and month/year navigation.

---

## 1. Import Path

```javascript
import Calendar from "@/components/Shared/Form/Calendar/Calendar";
```

---

## 2. Props Specification

| Prop Name      | Type             | Default | Required | Description                                              |
| -------------- | ---------------- | ------- | -------- | -------------------------------------------------------- |
| `selectedDate` | `Date \| string` | —       | No       | Current highlighted date.                                |
| `onSelectDate` | `function`       | —       | Yes      | Date selection handler callback: `(date: Date) => void`. |
| `minDate`      | `Date`           | —       | No       | Minimum selectable date constraint.                      |
| `maxDate`      | `Date`           | —       | No       | Maximum selectable date constraint.                      |
| `className`    | `string`         | `''`    | No       | Additional custom CSS class name.                        |

---

## 3. Usage Example

```jsx
import { useState } from "react";
import Calendar from "@/components/Shared/Form/Calendar/Calendar";

export default function CalendarWidget() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="calendar-panel">
      <Calendar selectedDate={date} onSelectDate={setDate} />
    </div>
  );
}
```
