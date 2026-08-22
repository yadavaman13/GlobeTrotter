# Card

A flexible surface container primitive providing consistent border radii (`$radius-large`), elevation shadows (`$shadow-premium`), and theme-aware surface backgrounds.

---

## 1. Import Path

```javascript
import Card from "@/components/Shared/DataDisplay/Card/Card";
```

---

## 2. Props Specification

| Prop Name   | Type                             | Default | Required | Description                                |
| ----------- | -------------------------------- | ------- | -------- | ------------------------------------------ |
| `children`  | `ReactNode`                      | —       | Yes      | Content inside card.                       |
| `padding`   | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'`  | No       | Internal container padding.                |
| `hoverable` | `boolean`                        | `false` | No       | Applies hover lift and shadow transitions. |
| `className` | `string`                         | `''`    | No       | Additional custom CSS class name.          |

---

## 3. Usage Example

```jsx
import Card from "@/components/Shared/DataDisplay/Card/Card";

export default function SummaryCard() {
  return (
    <Card hoverable padding="lg">
      <h3>Quarterly Forecast</h3>
      <p>Projected 24% increase in CRM conversions.</p>
    </Card>
  );
}
```
