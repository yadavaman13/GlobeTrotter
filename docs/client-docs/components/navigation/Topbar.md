# Topbar

The global header navigation bar featuring dynamic page titles derived from current route location, breadcrumb trails, notification dropdowns, and user profile menus.

---

## 1. Import Path

```javascript
import Topbar from "@/components/Shared/Navigation/Topbar/Topbar";
```

---

## 2. Props Specification

| Prop Name            | Type       | Default | Required | Description                                                      |
| -------------------- | ---------- | ------- | -------- | ---------------------------------------------------------------- |
| `onMobileMenuToggle` | `function` | —       | No       | Callback to open mobile navigation drawer.                       |
| `user`               | `object`   | —       | No       | Active user profile object (`{ name, email, avatarUrl, role }`). |
| `unreadCount`        | `number`   | `0`     | No       | Notification bell unread count badge.                            |
| `onLogout`           | `function` | —       | No       | Logout handler callback.                                         |

---

## 3. Usage Example

```jsx
import Topbar from "@/components/Shared/Navigation/Topbar/Topbar";
import { useAuth } from "@/app/features/auth/hooks/useAuth";

export default function DashboardHeader({ onToggleMobile }) {
  const { user, handleLogout } = useAuth();

  return (
    <Topbar
      user={user}
      onLogout={handleLogout}
      onMobileMenuToggle={onToggleMobile}
      unreadCount={3}
    />
  );
}
```
