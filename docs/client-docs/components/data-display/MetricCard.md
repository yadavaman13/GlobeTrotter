# MetricCard

A standalone numerical metric display card designed for summary analytics, badge counters, and secondary indicators.

---

## 1. Import Path

```javascript
import MetricCard from '@/components/Shared/DataDisplay/MetricCard/MetricCard';
```

---

## 2. Props Specification

| Prop Name      | Type                                              | Default     | Required | Description                     |
| -------------- | ------------------------------------------------- | ----------- | -------- | ------------------------------- |
| `label`        | `string`                                          | —           | Yes      | Small header label.             |
| `value`        | `string \| number`                                | —           | Yes      | Primary numerical metric.       |
| `subtitle`     | `string`                                          | —           | No       | Secondary caption or timestamp. |
| `badgeText`    | `string`                                          | —           | No       | Optional pill badge text.       |
| `badgeVariant` | `'primary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | No       | Badge color scheme.             |

---

## 3. Usage Example

```jsx
import MetricCard from '@/components/Shared/DataDisplay/MetricCard/MetricCard';

export default function AnalyticsSummary() {
    return (
        <MetricCard
            label="Avg. Deal Velocity"
            value="14.2 Days"
            subtitle="Calculated over past 90 days"
            badgeText="Fast"
            badgeVariant="success"
        />
    );
}
```
