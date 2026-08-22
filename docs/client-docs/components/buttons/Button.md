# Button

A versatile, high-performance base button primitive supporting multiple visual variants, size scaling, circular shapes, loading states, and premium shine hover effects.

---

## 1. Import Path

```javascript
import Button from '@/components/Shared/Buttons/Button/Button';
```

---

## 2. Props Specification

| Prop Name   | Type                                                                        | Default     | Required | Description                                                            |
| ----------- | --------------------------------------------------------------------------- | ----------- | -------- | ---------------------------------------------------------------------- |
| `children`  | `ReactNode`                                                                 | —           | No       | The button label, icon, or nested text.                                |
| `type`      | `'button' \| 'submit' \| 'reset'`                                           | `'button'`  | No       | Standard HTML button type attribute.                                   |
| `variant`   | `'primary' \| 'secondary' \| 'outline' \| 'danger' \| 'ghost' \| 'upgrade'` | `'primary'` | No       | Visual theme styling variant.                                          |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'icon' \| 'icon-sm'`                               | `'lg'`      | No       | Size preset controlling padding, font size, and height.                |
| `circle`    | `boolean`                                                                   | `false`     | No       | Renders the button as a perfect circle (useful for icon-only actions). |
| `loading`   | `boolean`                                                                   | `false`     | No       | Displays an animated spinner and disables user interaction.            |
| `disabled`  | `boolean`                                                                   | `false`     | No       | Disables click triggers and applies muted opacity.                     |
| `onClick`   | `function`                                                                  | —           | No       | Click handler callback: `(event) => void`.                             |
| `className` | `string`                                                                    | `''`        | No       | Additional custom CSS class name.                                      |

---

## 3. Usage Examples

### Primary Submit Button with Loading State

```jsx
import Button from '@/components/Shared/Buttons/Button/Button';
import { useAuth } from '@/app/features/auth/hooks/useAuth';

export default function SubmitExample() {
    const { loading } = useAuth();

    return (
        <Button type="submit" variant="primary" size="lg" loading={loading}>
            Save Changes
        </Button>
    );
}
```

### Secondary & Outlined Variants

```jsx
<div style={{ display: 'flex', gap: '12px' }}>
    <Button variant="primary">Confirm</Button>
    <Button variant="secondary">Cancel</Button>
    <Button variant="outline">Learn More</Button>
    <Button variant="danger">Delete Account</Button>
</div>
```

---

## 4. SCSS & Design Token Integration

- Stylesheet: `client/src/components/Shared/Buttons/Button/Button.scss`
- Variables used:
    - `$color-primary`, `$color-white`, `$color-gray-100`, `$color-gray-200`
    - `$radius-small` (`10px`), `$radius-medium` (`16px`)
    - `@include variables.transition-ease;`
    - `.btn-shine` sweep animation on hover
