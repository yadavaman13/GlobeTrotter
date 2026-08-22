# CodeBlock (AI Element)

A syntax-highlighted code container supporting multi-language syntax formatting, line numbering, and a one-click copy button.

---

## 1. Import Path

```javascript
import { CodeBlock } from '@/components/ai-elements/code-block/code-block';
```

---

## 2. Props Specification

| Prop Name         | Type      | Default        | Required | Description                                |
| ----------------- | --------- | -------------- | -------- | ------------------------------------------ |
| `code`            | `string`  | `''`           | Yes      | Raw code snippet string.                   |
| `language`        | `string`  | `'javascript'` | No       | Programming language for syntax highlight. |
| `showLineNumbers` | `boolean` | `false`        | No       | Renders line index numbers on the left.    |
| `className`       | `string`  | `''`           | No       | Custom CSS class name.                     |

---

## 3. Usage Example

```jsx
import { CodeBlock } from '@/components/ai-elements/code-block/code-block';

export default function SnippetDisplay({ snippet }) {
    return (
        <CodeBlock code={`const res = await axios.post('/api/ai/stream');`} language="javascript" />
    );
}
```
