# Checkbox

A custom-styled accessible checkbox input featuring an animated checkmark, label attachment, keyboard focus indicators, and disabled states.

---

## 1. Import Path

```javascript
import Checkbox from "@/components/Shared/Form/Checkbox/Checkbox";
```

---

## 2. Props Specification

| Prop Name   | Type                  | Default | Required | Description                           |
| ----------- | --------------------- | ------- | -------- | ------------------------------------- |
| `checked`   | `boolean`             | `false` | Yes      | Controlled checked state.             |
| `onChange`  | `function`            | —       | Yes      | Change event callback: `(e) => void`. |
| `label`     | `string \| ReactNode` | —       | No       | Accompanying label text or JSX.       |
| `id`        | `string`              | —       | No       | Checkbox input ID.                    |
| `disabled`  | `boolean`             | `false` | No       | Disables interaction.                 |
| `className` | `string`              | `''`    | No       | Additional custom CSS class name.     |

---

## 3. Usage Example

```jsx
import { useState } from "react";
import Checkbox from "@/components/Shared/Form/Checkbox/Checkbox";

export default function TermsAgreement() {
  const [agreed, setAgreed] = useState(false);

  return (
    <Checkbox
      id="terms-checkbox"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
      label="I accept the Terms and Conditions and Privacy Policy"
    />
  );
}
```
