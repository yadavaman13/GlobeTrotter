# Spinner

A smooth loading spinner component supporting multiple sizes, colors, and centered full-container layouts.

---

## 1. Import Path

```javascript
import Spinner from "@/components/Shared/Feedback/Spinner/Spinner";
```

---

## 2. Props Specification

| Prop Name   | Type                   | Default | Required | Description                                                              |
| ----------- | ---------------------- | ------- | -------- | ------------------------------------------------------------------------ |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`  | No       | Spinner dimensions (16px, 24px, 40px).                                   |
| `color`     | `string`               | —       | No       | Custom CSS color override.                                               |
| `centered`  | `boolean`              | `true`  | No       | Centers the spinner vertically and horizontally in its parent container. |
| `className` | `string`               | `''`    | No       | Additional CSS class name.                                               |

---

## 3. Usage Example

```jsx
import Spinner from "@/components/Shared/Feedback/Spinner/Spinner";

export default function LoadingContainer({ isLoading, children }) {
  if (isLoading) {
    return <Spinner size="lg" centered />;
  }
  return children;
}
```
