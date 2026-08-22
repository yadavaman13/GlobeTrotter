# PrevButton

A backward-navigation button featuring a left chevron icon used in pagination, multi-step wizards, and date sliders.

---

## 1. Import Path

```javascript
import PrevButton from "@/components/Shared/Buttons/PrevButton/PrevButton";
```

---

## 2. Props Specification

| Prop Name   | Type        | Default      | Required | Description                                  |
| ----------- | ----------- | ------------ | -------- | -------------------------------------------- |
| `onClick`   | `function`  | —            | Yes      | Backward navigation callback.                |
| `disabled`  | `boolean`   | `false`      | No       | Disables button when on the first page/step. |
| `children`  | `ReactNode` | `'Previous'` | No       | Label text.                                  |
| `className` | `string`    | `''`         | No       | Additional custom CSS class name.            |

---

## 3. Usage Example

```jsx
import PrevButton from "@/components/Shared/Buttons/PrevButton/PrevButton";

export default function WizardFooter({ currentStep, onPrev }) {
  return (
    <PrevButton disabled={currentStep === 1} onClick={onPrev}>
      Back
    </PrevButton>
  );
}
```
