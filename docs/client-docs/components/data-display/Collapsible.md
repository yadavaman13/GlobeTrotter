# Collapsible

A controlled collapsible disclosure primitive for toggling visibility of detail sections, advanced filters, and card content.

---

## 1. Import Path

```javascript
import Collapsible from "@/components/Shared/DataDisplay/Collapsible/Collapsible";
```

---

## 2. Props Specification

| Prop Name   | Type        | Default | Required | Description                     |
| ----------- | ----------- | ------- | -------- | ------------------------------- |
| `isOpen`    | `boolean`   | `false` | Yes      | Controlled open/closed state.   |
| `children`  | `ReactNode` | —       | Yes      | Content revealed when expanded. |
| `className` | `string`    | `''`    | No       | Custom CSS class name.          |

---

## 3. Usage Example

```jsx
import { useState } from "react";
import Collapsible from "@/components/Shared/DataDisplay/Collapsible/Collapsible";
import Button from "@/components/Shared/Buttons/Button/Button";

export default function AdvancedFilterToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="secondary" onClick={() => setOpen(!open)}>
        {open ? "Hide Advanced Filters" : "Show Advanced Filters"}
      </Button>
      <Collapsible isOpen={open}>
        <div style={{ marginTop: "12px" }}>
          <p>Additional search parameters go here...</p>
        </div>
      </Collapsible>
    </div>
  );
}
```
