# HeroPanel

A visual branding split-panel component displayed alongside login, registration, and password recovery forms, featuring dynamic marketing copy and ambient gradients.

---

## 1. Import Path

```javascript
import HeroPanel from "@/components/Shared/HeroPanel/HeroPanel";
```

---

## 2. Props Specification

| Prop Name   | Type     | Default | Required | Description                       |
| ----------- | -------- | ------- | -------- | --------------------------------- |
| `title`     | `string` | —       | No       | Hero branding headline.           |
| `subtitle`  | `string` | —       | No       | Supporting brand message.         |
| `className` | `string` | `''`    | No       | Additional custom CSS class name. |

---

## 3. Usage Example

```jsx
import HeroPanel from "@/components/Shared/HeroPanel/HeroPanel";
import LoginForm from "@/app/features/auth/components/LoginForm";

export default function LoginLayout() {
  return (
    <div className="auth-split-layout">
      <HeroPanel />
      <div className="auth-form-container">
        <LoginForm />
      </div>
    </div>
  );
}
```
