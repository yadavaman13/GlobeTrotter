# CircularAvatar

A circular user profile avatar component displaying user profile photos with automated fallback initials and status indicators.

---

## 1. Import Path

```javascript
import CircularAvatar from '@/components/Shared/DataDisplay/CircularAvatar/CircularAvatar';
```

---

## 2. Props Specification

| Prop Name   | Type                                        | Default | Required | Description                                              |
| ----------- | ------------------------------------------- | ------- | -------- | -------------------------------------------------------- |
| `src`       | `string`                                    | —       | No       | Image URL for user avatar.                               |
| `name`      | `string`                                    | —       | No       | User's full name (generates fallback 2-letter initials). |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'xl'`              | `'md'`  | No       | Diameter preset (28px, 36px, 48px, 64px).                |
| `status`    | `'online' \| 'offline' \| 'busy' \| 'away'` | —       | No       | Shows miniature status dot.                              |
| `className` | `string`                                    | `''`    | No       | Additional custom CSS class name.                        |

---

## 3. Usage Example

```jsx
import CircularAvatar from '@/components/Shared/DataDisplay/CircularAvatar/CircularAvatar';

export default function UserHeader({ user }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CircularAvatar src={user.avatarUrl} name={user.name} size="lg" status="online" />
            <div>
                <h4>{user.name}</h4>
                <p>{user.role}</p>
            </div>
        </div>
    );
}
```
