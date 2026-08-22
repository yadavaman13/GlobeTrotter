# OtpInput

A multi-cell digit input component designed for OTP security codes. Automatically advances cursor focus on input and handles backspace reversals and paste events.

---

## 1. Import Path

```javascript
import OtpInput from '@/components/Shared/Form/OtpInput/OtpInput';
```

---

## 2. Props Specification

| Prop Name  | Type       | Default | Required | Description                                  |
| ---------- | ---------- | ------- | -------- | -------------------------------------------- |
| `length`   | `number`   | `6`     | No       | Number of digit input boxes.                 |
| `value`    | `string`   | `''`    | Yes      | Controlled OTP code string.                  |
| `onChange` | `function` | —       | Yes      | Callback: `(code: string) => void`.          |
| `disabled` | `boolean`  | `false` | No       | Disables input cells.                        |
| `error`    | `boolean`  | `false` | No       | Highlights all cells with error red outline. |

---

## 3. Usage Example

```jsx
import { useState } from 'react';
import OtpInput from '@/components/Shared/Form/OtpInput/OtpInput';

export default function TwoFactorCode() {
    const [code, setCode] = useState('');

    return (
        <div style={{ textAlign: 'center' }}>
            <p>Enter 6-digit verification code</p>
            <OtpInput length={6} value={code} onChange={setCode} />
        </div>
    );
}
```
