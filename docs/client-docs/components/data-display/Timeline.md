# Timeline

A vertical event timeline stream component displaying milestones, audit history, and chronological project status changes.

---

## 1. Import Path

```javascript
import Timeline from "@/components/Shared/DataDisplay/Timeline/Timeline";
```

---

## 2. Props Specification

| Prop Name   | Type                                                                                                                            | Default | Required | Description                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- | ------- | -------- | ---------------------------- |
| `events`    | `Array<{ id: string, title: string, description?: string, timestamp: string, status?: 'completed' \| 'current' \| 'pending' }>` | `[]`    | Yes      | List of timeline milestones. |
| `className` | `string`                                                                                                                        | `''`    | No       | Custom CSS class name.       |

---

## 3. Usage Example

```jsx
import Timeline from "@/components/Shared/DataDisplay/Timeline/Timeline";

export default function OrderAuditTrail({ events }) {
  return <Timeline events={events} />;
}
```
