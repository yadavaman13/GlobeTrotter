# ServerErrorPage

A full-page 500 Internal Server Error view component with retry triggers and status reporting.

---

## 1. Import Path

```javascript
import ServerErrorPage from '@/components/Shared/ErrorPages/ServerErrorPage/ServerErrorPage';
```

---

## 2. Props Specification

| Prop Name | Type       | Default                                            | Required | Description              |
| --------- | ---------- | -------------------------------------------------- | -------- | ------------------------ |
| `message` | `string`   | `'Internal Server Error. Please try again later.'` | No       | Custom error message.    |
| `onRetry` | `function` | —                                                  | No       | Retry callback function. |

---

## 3. Usage Example

```jsx
import ServerErrorPage from '@/components/Shared/ErrorPages/ServerErrorPage/ServerErrorPage';

export default function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
    return <ServerErrorPage message={error?.message} onRetry={resetErrorBoundary} />;
}
```
