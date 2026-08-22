# RoleSelector

A visual selection component allowing users to choose an organizational role (e.g. `'developer'`, `'admin'`, `'manager'`) via interactive highlighted cards with role descriptions.

---

## 1. Import Path

```javascript
import RoleSelector from "@/components/Shared/Form/RoleSelector/RoleSelector";
```

---

## 2. Props Specification

| Prop Name      | Type                                                                          | Default          | Required | Description                           |
| -------------- | ----------------------------------------------------------------------------- | ---------------- | -------- | ------------------------------------- |
| `selectedRole` | `string`                                                                      | —                | Yes      | Currently selected role identifier.   |
| `onChange`     | `function`                                                                    | —                | Yes      | Callback: `(role: string) => void`.   |
| `roles`        | `Array<{ id: string, title: string, description: string, icon?: Component }>` | Predefined roles | No       | Optional custom list of role options. |
| `disabled`     | `boolean`                                                                     | `false`          | No       | Disables role selection.              |

---

## 3. Usage Example

```jsx
import { useState } from "react";
import RoleSelector from "@/components/Shared/Form/RoleSelector/RoleSelector";

export default function OnboardingRoleStep({ onSelectRole }) {
  const [role, setRole] = useState("developer");

  return (
    <RoleSelector
      selectedRole={role}
      onChange={(newRole) => {
        setRole(newRole);
        onSelectRole(newRole);
      }}
    />
  );
}
```
