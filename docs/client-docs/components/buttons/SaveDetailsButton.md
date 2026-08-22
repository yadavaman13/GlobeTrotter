# SaveDetailsButton

A specialized primary action button used for committing form details, profile updates, and setting changes.

---

## 1. Import Path

```javascript
import SaveDetailsButton from '@/components/Shared/Buttons/SaveDetailsButton/SaveDetailsButton';
```

---

## 2. Props Specification

| Prop Name   | Type                   | Default          | Required | Description                                         |
| ----------- | ---------------------- | ---------------- | -------- | --------------------------------------------------- |
| `onClick`   | `function`             | —                | No       | Form submission or click handler callback.          |
| `children`  | `ReactNode`            | `'Save Details'` | No       | Button label text.                                  |
| `disabled`  | `boolean`              | `false`          | No       | Disables click triggers.                            |
| `loading`   | `boolean`              | `false`          | No       | Shows loading state and disables user interactions. |
| `type`      | `'button' \| 'submit'` | `'button'`       | No       | Button type attribute.                              |
| `className` | `string`               | `''`             | No       | Additional custom CSS class name.                   |

---

## 3. Usage Example

```jsx
import SaveDetailsButton from '@/components/Shared/Buttons/SaveDetailsButton/SaveDetailsButton';

export default function ProfileForm({ isSaving, onSave }) {
    return (
        <SaveDetailsButton type="submit" loading={isSaving} onClick={onSave}>
            Save Profile
        </SaveDetailsButton>
    );
}
```
