# KpiLineChartCard

A dedicated KPI metric trend chart card combining numerical stats with an interactive mini line trace.

---

## 1. Import Path

```javascript
import KpiLineChartCard from "@/components/Shared/DataDisplay/KpiLineChartCard/KpiLineChartCard";
```

---

## 2. Props Specification

| Prop Name         | Type               | Default     | Required | Description                               |
| ----------------- | ------------------ | ----------- | -------- | ----------------------------------------- |
| `title`           | `string`           | —           | Yes      | Card metric header.                       |
| `currentValue`    | `string \| number` | —           | Yes      | Primary formatted metric value.           |
| `trendPercentage` | `string`           | —           | No       | Percentage change string (e.g. `'+14%'`). |
| `dataPoints`      | `Array<number>`    | `[]`        | Yes      | Numerical series plotted on line chart.   |
| `labels`          | `Array<string>`    | `[]`        | No       | X-axis coordinate labels.                 |
| `color`           | `string`           | `'#2b7af3'` | No       | Line chart trace color token.             |

---

## 3. Usage Example

```jsx
import KpiLineChartCard from "@/components/Shared/DataDisplay/KpiLineChartCard/KpiLineChartCard";

export default function SalesTrend() {
  return (
    <KpiLineChartCard
      title="Monthly Sales Volume"
      currentValue="₹4,25,000"
      trendPercentage="+12.4%"
      dataPoints={[30, 45, 60, 50, 75, 90, 110]}
      labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
    />
  );
}
```
