# StatCard

A high-visibility KPI metric summary card component displaying numbers, trend percentages (positive/negative), trend arrows, icons, and comparison intervals.

---

## 1. Import Path

```javascript
import StatCard from "@/components/Shared/DataDisplay/StatCard/StatCard";
```

---

## 2. Props Specification

| Prop Name        | Type               | Default           | Required | Description                                       |
| ---------------- | ------------------ | ----------------- | -------- | ------------------------------------------------- |
| `title`          | `string`           | —                 | Yes      | Metric card title (e.g. `'Total Revenue'`).       |
| `value`          | `string \| number` | —                 | Yes      | Primary metric value (e.g. `'$128,450'`).         |
| `icon`           | `Component`        | —                 | No       | Lucide React icon component.                      |
| `trend`          | `string`           | —                 | No       | Trend indicator text (e.g. `'+12.5%'`, `'-4%'`).  |
| `trendPositive`  | `boolean`          | `true`            | No       | Renders trend in green (`true`) or red (`false`). |
| `comparisonText` | `string`           | `'vs last month'` | No       | Subtitle context for the trend.                   |
| `className`      | `string`           | `''`              | No       | Custom CSS class name.                            |

---

## 3. Usage Example

```jsx
import StatCard from "@/components/Shared/DataDisplay/StatCard/StatCard";
import { DollarSign, Users, TrendingUp } from "lucide-react";

export default function DashboardStats() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
    >
      <StatCard
        title="Total Revenue"
        value="$128,450"
        icon={DollarSign}
        trend="+18.2%"
        trendPositive={true}
      />
      <StatCard
        title="Active Deals"
        value="42"
        icon={TrendingUp}
        trend="+5.4%"
        trendPositive={true}
      />
      <StatCard
        title="Customer Churn"
        value="1.2%"
        icon={Users}
        trend="-0.8%"
        trendPositive={true}
      />
    </div>
  );
}
```
