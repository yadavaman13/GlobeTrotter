# OtpVerificationForm

A complete, self-contained OTP verification card component with 6-digit input, submit button, live 30-second resend cooldown timer (`resendCooldown`), and resend code action link.

---

## 1. Import Path

```javascript
import OtpVerificationForm from "@/components/Shared/Form/OtpVerificationForm/OtpVerificationForm";
```

---

## 2. Props Specification

| Prop Name  | Type       | Default | Required | Description                                          |
| ---------- | ---------- | ------- | -------- | ---------------------------------------------------- |
| `email`    | `string`   | —       | Yes      | Target user email address for display.               |
| `onVerify` | `function` | —       | Yes      | Callback: `(code: string) => Promise<void> \| void`. |
| `onResend` | `function` | —       | Yes      | Callback fired when user clicks 'Resend Code'.       |
| `loading`  | `boolean`  | `false` | No       | Shows loading spinner on verify button.              |
| `error`    | `string`   | —       | No       | Verification error message string.                   |

---

## 3. Usage Example

```jsx
import OtpVerificationForm from "@/components/Shared/Form/OtpVerificationForm/OtpVerificationForm";

export default function VerifyStep({
  email,
  handleVerifyOtp,
  handleResendCode,
  isSubmitting,
  errorMessage,
}) {
  return (
    <OtpVerificationForm
      email={email}
      onVerify={handleVerifyOtp}
      onResend={handleResendCode}
      loading={isSubmitting}
      error={errorMessage}
    />
  );
}
```
