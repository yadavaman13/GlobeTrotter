# DateTimePicker

A combined date and time picker input component designed for scheduling calendar events, meetings, and task deadlines.

---

## 1. Import Path

```javascript
import DateTimePicker from "@/components/Shared/Form/DateTimePicker/DateTimePicker";
```

---

## 2. Props Specification

| Prop Name  | Type             | Default | Required | Description                                  |
| ---------- | ---------------- | ------- | -------- | -------------------------------------------- |
| `label`    | `string`         | —       | No       | Label rendered above input.                  |
| `value`    | `string \| Date` | —       | No       | Selected ISO datetime string or Date object. |
| `onChange` | `function`       | —       | Yes      | Callback: `(datetime: string) => void`.      |
| `error`    | `string`         | —       | No       | Validation error message.                    |
| `disabled` | `boolean`        | `false` | No       | Disables picker.                             |

---

## 3. Usage Example

```jsx
import { useState } from "react";
import DateTimePicker from "@/components/Shared/Form/DateTimePicker/DateTimePicker";

export default function MeetingScheduler() {
  const [meetingTime, setMeetingTime] = useState("");

  return (
    <DateTimePicker
      label="Schedule Demo"
      value={meetingTime}
      onChange={setMeetingTime}
    />
  );
}
```
