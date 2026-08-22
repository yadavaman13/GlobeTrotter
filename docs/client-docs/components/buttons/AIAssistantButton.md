# AIAssistantButton

A specialized, glowing action button designed for triggering AI Copilot actions, chat sidebars, and automated agent workflows.

---

## 1. Import Path

```javascript
import AIAssistantButton from "@/components/Shared/Buttons/AIAssistantButton/AIAssistantButton";
```

---

## 2. Props Specification

| Prop Name   | Type        | Default            | Required | Description                                                     |
| ----------- | ----------- | ------------------ | -------- | --------------------------------------------------------------- |
| `children`  | `ReactNode` | `'Ask AI Copilot'` | No       | Text or elements rendered inside the button.                    |
| `onClick`   | `function`  | —                  | No       | Click callback function.                                        |
| `disabled`  | `boolean`   | `false`            | No       | Disables click triggers and dims pulse animations.              |
| `isGlowing` | `boolean`   | `true`             | No       | Controls whether the continuous pulse/glow animation is active. |
| `className` | `string`    | `''`               | No       | Additional custom CSS class name.                               |

---

## 3. Usage Example

```jsx
import AIAssistantButton from "@/components/Shared/Buttons/AIAssistantButton/AIAssistantButton";
import { useNavigate } from "react-router";

export default function HeaderAIAction() {
  const navigate = useNavigate();

  return (
    <AIAssistantButton onClick={() => navigate("/dashboard/user/ai")}>
      Launch AI Assistant
    </AIAssistantButton>
  );
}
```

---

## 4. SCSS & Design Token Integration

- Stylesheet: `client/src/components/Shared/Buttons/AIAssistantButton/AIAssistantButton.scss`
- Variables used:
  - `$color-primary`, `$color-blue-accent`, `$color-blue-hover`
  - `$radius-small` (`10px`), `$shadow-md`
  - `@include variables.transition-ease;`
