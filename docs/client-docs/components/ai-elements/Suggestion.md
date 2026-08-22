# Suggestion (AI Element)

A clickable suggested prompt pill component for quick starter questions and conversational shortcuts.

---

## 1. Import Path

```javascript
import { Suggestion, SuggestionsList } from '@/components/ai-elements/suggestion/suggestion';
```

---

## 2. Props Specification

| Prop Name     | Type            | Default | Required | Description                           |
| ------------- | --------------- | ------- | -------- | ------------------------------------- |
| `suggestions` | `Array<string>` | `[]`    | Yes      | List of recommended prompt strings.   |
| `onSelect`    | `function`      | —       | Yes      | Callback: `(prompt: string) => void`. |

---

## 3. Usage Example

```jsx
import { SuggestionsList } from '@/components/ai-elements/suggestion/suggestion';

const samplePrompts = [
    'Summarize this quarter’s top 5 revenue deals',
    'Which leads are overdue for follow-up?',
    'Generate an invoice PDF for Acme Corp',
];

export default function StarterPrompts({ onChoosePrompt }) {
    return <SuggestionsList suggestions={samplePrompts} onSelect={onChoosePrompt} />;
}
```
