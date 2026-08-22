# ToggleButton

A controlled on/off toggle switch component featuring an animated capsule track, thumb disc, checkmark indicator, and support for multiple size and color variants.

---

## 1. Import Path

```javascript
import ToggleButton from "@/components/Shared/Buttons/ToggleButton/ToggleButton";
```

---

## 2. Props Specification

| Prop Name       | Type                                                           | Default        | Required | Description                                               |
| --------------- | -------------------------------------------------------------- | -------------- | -------- | --------------------------------------------------------- |
| `checked`       | `boolean`                                                      | `false`        | No       | Controlled toggle state (true = on, false = off).         |
| `onChange`      | `function`                                                     | —              | Yes      | State change callback: `(checked: boolean) => void`.      |
| `label`         | `string`                                                       | —              | No       | Accompanying label text.                                  |
| `labelPos`      | `'left' \| 'right'`                                            | `'right'`      | No       | Alignment position of label text relative to switch.      |
| `variant`       | `'primary' \| 'success' \| 'danger' \| 'warning' \| 'default'` | `'primary'`    | No       | Color theme when active/on.                               |
| `size`          | `'sm' \| 'md' \| 'lg'`                                         | `'md'`         | No       | Switch scale preset.                                      |
| `showCheckmark` | `boolean`                                                      | `true`         | No       | Shows miniature checkmark inside the active switch thumb. |
| `disabled`      | `boolean`                                                      | `false`        | No       | Disables toggle interaction.                              |
| `id`            | `string`                                                       | auto-generated | No       | Custom input id.                                          |
| `className`     | `string`                                                       | `''`           | No       | Additional custom CSS class name.                         |

---

## 3. Usage Example

```jsx
import { useState } from "react";
import ToggleButton from "@/components/Shared/Buttons/ToggleButton/ToggleButton";

export default function NotificationSettings() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ToggleButton
        label="Email Notifications"
        checked={emailEnabled}
        onChange={setEmailEnabled}
        variant="primary"
      />
      <ToggleButton
        label="SMS Alerts"
        checked={smsEnabled}
        onChange={setSmsEnabled}
        variant="success"
      />
    </div>
  );
}
```
