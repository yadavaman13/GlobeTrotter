# NotFoundPage

A full-page 404 Not Found error view component with graphical illustration, helpful guidance, and a return to home button.

---

## 1. Import Path

```javascript
import NotFoundPage from "@/components/Shared/ErrorPages/NotFoundPage/NotFoundPage";
```

---

## 2. Props Specification

| Prop Name | Type     | Default                                          | Required | Description     |
| --------- | -------- | ------------------------------------------------ | -------- | --------------- |
| `message` | `string` | `'The page you are looking for does not exist.'` | No       | Custom message. |

---

## 3. Usage Example

```jsx
import NotFoundPage from "@/components/Shared/ErrorPages/NotFoundPage/NotFoundPage";

export default function CatchAllRoute() {
  return <NotFoundPage />;
}
```
