# AnalyticsLineChartCard

A reusable analytics line chart card primitive featuring header controls, period selectors, KPI current values, and multi-series line chart rendering.

---

## 1. Import Path

```javascript
import AnalyticsLineChartCard from '@/components/Shared/AnalyticsLineChartCard/AnalyticsLineChartCard';
```

---

## 2. Props Specification

| Prop Name        | Type                             | Default | Required | Description                                                     |
| ---------------- | -------------------------------- | ------- | -------- | --------------------------------------------------------------- |
| `title`          | `string`                         | —       | Yes      | Card header title.                                              |
| `subtitle`       | `string`                         | —       | No       | Secondary caption.                                              |
| `data`           | `object`                         | —       | Yes      | Time-series dataset object containing labels and series arrays. |
| `period`         | `'7d' \| '30d' \| '90d' \| '1y'` | `'30d'` | No       | Active time interval.                                           |
| `onPeriodChange` | `function`                       | —       | No       | Callback when period tab changes.                               |

---

## 3. Usage Example

```jsx
import AnalyticsLineChartCard from '@/components/Shared/AnalyticsLineChartCard/AnalyticsLineChartCard';

export default function InsightsSection() {
    const chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        currentPeriod: [120, 190, 300, 500],
        previousPeriod: [100, 150, 220, 380],
    };

    return (
        <AnalyticsLineChartCard
            title="Revenue Velocity"
            subtitle="Comparing current month against previous month"
            data={chartData}
        />
    );
}
```
