# Accordion

A multi-section collapsible container primitive with animated accordion panels, chevron indicators, and single/multiple expansion modes.

---

## 1. Import Path

```javascript
import Accordion from "@/components/Shared/DataDisplay/Accordion/Accordion";
```

---

## 2. Props Specification

| Prop Name       | Type                                                       | Default | Required | Description                                           |
| --------------- | ---------------------------------------------------------- | ------- | -------- | ----------------------------------------------------- |
| `items`         | `Array<{ id: string, title: string, content: ReactNode }>` | `[]`    | Yes      | List of accordion sections.                           |
| `allowMultiple` | `boolean`                                                  | `false` | No       | Allows multiple panels to remain open simultaneously. |
| `className`     | `string`                                                   | `''`    | No       | Custom CSS class name.                                |

---

## 3. Usage Example

```jsx
import Accordion from "@/components/Shared/DataDisplay/Accordion/Accordion";

const faqItems = [
  {
    id: "1",
    title: "How do I connect my Odoo CRM database?",
    content: "Configure your credentials in Settings > Integrations.",
  },
  {
    id: "2",
    title: "Is real-time SSE token streaming supported?",
    content: "Yes, the AI copilot supports full SSE event streaming.",
  },
];

export default function FAQ() {
  return <Accordion items={faqItems} />;
}
```
