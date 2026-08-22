# EmptyStateCard

A card-encapsulated empty state placeholder component tailored for dashboards, side panels, and widget containers.

---

## 1. Import Path

```javascript
import EmptyStateCard from '@/components/Shared/DataDisplay/EmptyStateCard/EmptyStateCard';
```

---

## 2. Props Specification

| Prop Name  | Type        | Default | Required | Description                             |
| ---------- | ----------- | ------- | -------- | --------------------------------------- |
| `title`    | `string`    | —       | Yes      | Heading text.                           |
| `subtitle` | `string`    | —       | No       | Supporting detail text.                 |
| `action`   | `ReactNode` | —       | No       | Optional custom button or link element. |

---

## 3. Usage Example

```jsx
import EmptyStateCard from '@/components/Shared/DataDisplay/EmptyStateCard/EmptyStateCard';
import Button from '@/components/Shared/Buttons/Button/Button';

export default function FeedEmptyState() {
    return (
        <EmptyStateCard
            title="No Recent Activity"
            subtitle="Recent actions across leads and deals will appear here."
            action={
                <Button size="sm" variant="outline">
                    Refresh Feed
                </Button>
            }
        />
    );
}
```
