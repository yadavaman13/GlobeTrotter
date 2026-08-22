# ActivitiesFeed

An activity feed container component rendering chronological logs, user avatar badges, action summaries, timestamps, and item details.

---

## 1. Import Path

```javascript
import ActivitiesFeedCard from '@/components/Shared/DataDisplay/ActivitiesFeed/ActivitiesFeedCard';
```

---

## 2. Props Specification

| Prop Name     | Type                                                                                                 | Default               | Required | Description                   |
| ------------- | ---------------------------------------------------------------------------------------------------- | --------------------- | -------- | ----------------------------- |
| `activities`  | `Array<{ id: string, user: string, avatar?: string, action: string, target: string, time: string }>` | `[]`                  | Yes      | List of activity events.      |
| `title`       | `string`                                                                                             | `'Recent Activities'` | No       | Card header title.            |
| `onItemClick` | `function`                                                                                           | —                     | No       | Click callback on feed items. |

---

## 3. Usage Example

```jsx
import ActivitiesFeedCard from '@/components/Shared/DataDisplay/ActivitiesFeed/ActivitiesFeedCard';

export default function RecentTeamFeed({ activities }) {
    return <ActivitiesFeedCard title="Team Activity Log" activities={activities} />;
}
```
