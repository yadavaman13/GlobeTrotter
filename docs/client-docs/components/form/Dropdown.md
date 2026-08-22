# Dropdown

A custom-styled select dropdown control featuring an animated popover menu, chevron indicator, keyboard navigation, clearable options, and error validation states.

---

## 1. Import Path

```javascript
import Dropdown from "@/components/Shared/Form/Dropdown/Dropdown";
```

---

## 2. Props Specification

| Prop Name     | Type                                                | Default              | Required | Description                                                 |
| ------------- | --------------------------------------------------- | -------------------- | -------- | ----------------------------------------------------------- |
| `label`       | `string`                                            | —                    | No       | Label rendered above dropdown.                              |
| `options`     | `Array<{ value: string \| number, label: string }>` | `[]`                 | Yes      | List of selectable dropdown options.                        |
| `value`       | `string \| number`                                  | —                    | No       | Selected option value.                                      |
| `onChange`    | `function`                                          | —                    | Yes      | Callback on selection: `(value: string \| number) => void`. |
| `placeholder` | `string`                                            | `'Select an option'` | No       | Text displayed when no value is selected.                   |
| `error`       | `string`                                            | —                    | No       | Validation error message.                                   |
| `disabled`    | `boolean`                                           | `false`              | No       | Disables interaction.                                       |
| `id`          | `string`                                            | —                    | No       | Element ID.                                                 |

---

## 3. Usage Example

```jsx
import { useState } from "react";
import Dropdown from "@/components/Shared/Form/Dropdown/Dropdown";

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed Won" },
];

export default function StatusFilter() {
  const [selectedStatus, setSelectedStatus] = useState("all");

  return (
    <Dropdown
      label="Lead Status"
      options={statusOptions}
      value={selectedStatus}
      onChange={setSelectedStatus}
    />
  );
}
```
