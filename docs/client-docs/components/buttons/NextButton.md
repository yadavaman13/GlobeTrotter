# NextButton

A forward-navigation button featuring a right chevron icon used in pagination, multi-step wizards, and date sliders.

---

## 1. Import Path

```javascript
import NextButton from "@/components/Shared/Buttons/NextButton/NextButton";
```

---

## 2. Props Specification

| Prop Name   | Type        | Default  | Required | Description                                  |
| ----------- | ----------- | -------- | -------- | -------------------------------------------- |
| `onClick`   | `function`  | —        | Yes      | Forward trigger callback.                    |
| `disabled`  | `boolean`   | `false`  | No       | Disables button when on the final page/step. |
| `children`  | `ReactNode` | `'Next'` | No       | Label text.                                  |
| `className` | `string`    | `''`     | No       | Additional custom CSS class name.            |

---

## 3. Usage Example

```jsx
import NextButton from "@/components/Shared/Buttons/NextButton/NextButton";

export default function WizardFooter({ currentStep, totalSteps, onNext }) {
  return (
    <NextButton disabled={currentStep === totalSteps} onClick={onNext}>
      Continue
    </NextButton>
  );
}
```
