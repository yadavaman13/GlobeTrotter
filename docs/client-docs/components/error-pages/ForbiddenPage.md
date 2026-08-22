# ForbiddenPage

A standardized full-page 403 Forbidden / Access Denied error view component with lock illustration, explanatory text, and a return-to-home action CTA.

---

## 1. Import Path

```javascript
import ForbiddenPage from '@/components/Shared/ErrorPages/ForbiddenPage/ForbiddenPage';
```

---

## 2. Props Specification

| Prop Name      | Type       | Default                                           | Required | Description                 |
| -------------- | ---------- | ------------------------------------------------- | -------- | --------------------------- |
| `message`      | `string`   | `'You do not have permission to view this page.'` | No       | Custom error message.       |
| `onReturnHome` | `function` | —                                                 | No       | Optional redirect callback. |

---

## 3. Usage Example

```jsx
import ForbiddenPage from '@/components/Shared/ErrorPages/ForbiddenPage/ForbiddenPage';

export default function AccessDenied() {
    return <ForbiddenPage message="Administrator privileges are required for this CRM section." />;
}
```
