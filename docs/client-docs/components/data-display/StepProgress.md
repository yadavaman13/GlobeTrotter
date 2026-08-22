# StepProgress

A multi-step progress indicator for onboarding wizards, registration steps, and multi-stage form flows.

---

## 1. Import Path

```javascript
import StepProgress from '@/components/Shared/DataDisplay/StepProgress/StepProgress';
```

---

## 2. Props Specification

| Prop Name     | Type                                             | Default | Required | Description                   |
| ------------- | ------------------------------------------------ | ------- | -------- | ----------------------------- |
| `steps`       | `Array<{ id: number \| string, title: string }>` | `[]`    | Yes      | List of step milestones.      |
| `currentStep` | `number`                                         | `1`     | Yes      | 1-indexed active step number. |

---

## 3. Usage Example

```jsx
import StepProgress from '@/components/Shared/DataDisplay/StepProgress/StepProgress';

const wizardSteps = [
    { id: 1, title: 'Account Details' },
    { id: 2, title: 'Company Setup' },
    { id: 3, title: 'Review & Confirm' },
];

export default function OnboardingWizard({ activeStep }) {
    return <StepProgress steps={wizardSteps} currentStep={activeStep} />;
}
```
