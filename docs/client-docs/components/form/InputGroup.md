# InputGroup

A compound input component that binds text fields with attached leading or trailing icons, buttons, dropdown selects, or currency symbols.

---

## 1. Import Path

```javascript
import InputGroup from "@/components/Shared/Form/InputGroup/InputGroup";
```

---

## 2. Props Specification

| Prop Name   | Type        | Default | Required | Description                                                           |
| ----------- | ----------- | ------- | -------- | --------------------------------------------------------------------- |
| `children`  | `ReactNode` | —       | Yes      | Child inputs and attachment elements.                                 |
| `prefix`    | `ReactNode` | —       | No       | Element rendered inside/before the input (e.g. `$`, `@`).             |
| `suffix`    | `ReactNode` | —       | No       | Element rendered inside/after the input (e.g. `.com`, action button). |
| `className` | `string`    | `''`    | No       | Additional custom CSS class name.                                     |

---

## 3. Usage Example

```jsx
import InputGroup from "@/components/Shared/Form/InputGroup/InputGroup";

export default function CurrencyInput({ value, onChange }) {
  return (
    <InputGroup prefix="$" suffix="USD">
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder="0.00"
      />
    </InputGroup>
  );
}
```
