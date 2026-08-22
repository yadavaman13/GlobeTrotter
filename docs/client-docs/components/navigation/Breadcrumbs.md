# Breadcrumbs

A hierarchical trail navigation component linking parent routes with active child views.

---

## 1. Import Path

```javascript
import Breadcrumbs from '@/components/Shared/Navigation/Breadcrumbs/Breadcrumbs';
```

---

## 2. Props Specification

| Prop Name | Type                                      | Default | Required | Description                                          |
| --------- | ----------------------------------------- | ------- | -------- | ---------------------------------------------------- |
| `items`   | `Array<{ label: string, path?: string }>` | `[]`    | Yes      | List of trail crumb items (trailing item is active). |

---

## 3. Usage Example

```jsx
import Breadcrumbs from '@/components/Shared/Navigation/Breadcrumbs/Breadcrumbs';

export default function AnalyticsBreadcrumb() {
    return (
        <Breadcrumbs
            items={[
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'Analytics', path: '/dashboard/user/analytics' },
                { label: 'Revenue Insights' },
            ]}
        />
    );
}
```
