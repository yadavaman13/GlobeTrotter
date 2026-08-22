# Confirmation (AI Element)

An interactive tool approval prompt rendered in the chat stream when an AI agent requests confirmation before executing high-impact CRM mutations (e.g. bulk email, deal deletion).

---

## 1. Import Path

```javascript
import { Confirmation } from "@/components/ai-elements/confirmation/confirmation";
```

---

## 2. Props Specification

| Prop Name     | Type       | Default            | Required | Description                               |
| ------------- | ---------- | ------------------ | -------- | ----------------------------------------- |
| `title`       | `string`   | `'Confirm Action'` | No       | Prompt title text.                        |
| `description` | `string`   | —                  | Yes      | Action explanation and parameter summary. |
| `onApprove`   | `function` | —                  | Yes      | Approval callback: `() => void`.          |
| `onReject`    | `function` | —                  | Yes      | Rejection callback: `() => void`.         |
| `loading`     | `boolean`  | `false`            | No       | Shows execution loading state.            |

---

## 3. Usage Example

```jsx
import { Confirmation } from "@/components/ai-elements/confirmation/confirmation";

export default function ToolApprovalCard({
  toolCall,
  handleApprove,
  handleReject,
}) {
  return (
    <Confirmation
      title="Update Lead Stage"
      description="Move deal 'Acme Corp' to Closed Won with value ₹1,50,000?"
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
```
