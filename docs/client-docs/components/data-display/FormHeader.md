# FormHeader

A standardized heading component used at the top of authentication cards, forms, and modal dialogs with title, subtitle, and badge.

---

## 1. Import Path

```javascript
import FormHeader from '@/components/Shared/DataDisplay/FormHeader/FormHeader';
```

---

## 2. Props Specification

| Prop Name   | Type     | Default | Required | Description                    |
| ----------- | -------- | ------- | -------- | ------------------------------ |
| `title`     | `string` | —       | Yes      | Primary form title.            |
| `subtitle`  | `string` | —       | No       | Secondary caption description. |
| `className` | `string` | `''`    | No       | Custom CSS class name.         |

---

## 3. Usage Example

```jsx
import FormHeader from '@/components/Shared/DataDisplay/FormHeader/FormHeader';

export default function RegisterCardHeader() {
    return (
        <FormHeader title="Create an Account" subtitle="Start managing your Odoo CRM deals today" />
    );
}
```
