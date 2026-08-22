# InputField

A standardized text, email, and password input component featuring integrated label management, password visibility toggles, CapsLock detection warnings, and accessible error message layouts.

---

## 1. Import Path

```javascript
import InputField from '@/components/Shared/Form/InputField/InputField';
```

---

## 2. Props Specification

| Prop Name      | Type                                                   | Default  | Required | Description                                                         |
| -------------- | ------------------------------------------------------ | -------- | -------- | ------------------------------------------------------------------- |
| `label`        | `string`                                               | —        | Yes      | Label text rendered above the input.                                |
| `id`           | `string`                                               | —        | Yes      | Unique element ID (associated with label `htmlFor`).                |
| `type`         | `'text' \| 'password' \| 'email' \| 'number' \| 'tel'` | `'text'` | No       | HTML input type. When `'password'`, auto-renders visibility toggle. |
| `placeholder`  | `string`                                               | —        | No       | Input placeholder string.                                           |
| `value`        | `string \| number`                                     | —        | Yes      | Controlled input value.                                             |
| `onChange`     | `function`                                             | —        | Yes      | Input change handler callback: `(e) => void`.                       |
| `error`        | `string`                                               | —        | No       | Error message displayed beneath input; applies error border.        |
| `autoComplete` | `string`                                               | —        | No       | HTML autocomplete attribute hint (e.g. `'current-password'`).       |
| `disabled`     | `boolean`                                              | `false`  | No       | Disables input interactions.                                        |
| `inputRef`     | `RefObject`                                            | —        | No       | React ref forwarded to the underlying `<input>`.                    |

---

## 3. Usage Example

```jsx
import { useState } from 'react';
import InputField from '@/components/Shared/Form/InputField/InputField';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    return (
        <form className="auth-form">
            <InputField
                label="Email"
                id="login-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
                label="Password"
                id="login-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
            />
        </form>
    );
}
```

---

## 4. SCSS & Design Tokens

- Stylesheet: `client/src/components/Shared/Form/InputField/InputField.scss`
- Variables used:
    - `$color-gray-100` (`#f3f4f6`), `$color-gray-900`, `$color-danger` (`#ef4444`)
    - `$radius-small` (`10px`)
    - `@include variables.transition-ease;`
