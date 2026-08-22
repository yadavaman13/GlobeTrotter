# Message (AI Element)

A chat bubble component rendering User and Assistant responses with support for markdown rendering (tables, bold, lists), code block highlighting, LaTeX math formatting, and action toolbars (copy, retry).

---

## 1. Import Path

```javascript
import {
    Message,
    MessageContent,
    MessageAvatar,
    MessageActions,
} from '@/components/ai-elements/message/message';
```

---

## 2. Props Specification

| Prop Name     | Type                                | Default  | Required | Description                                |
| ------------- | ----------------------------------- | -------- | -------- | ------------------------------------------ |
| `role`        | `'user' \| 'assistant' \| 'system'` | `'user'` | Yes      | Author of message.                         |
| `content`     | `string`                            | —        | Yes      | Markdown text body.                        |
| `isStreaming` | `boolean`                           | `false`  | No       | Shows blinking streaming cursor indicator. |
| `createdAt`   | `string \| Date`                    | —        | No       | Message timestamp.                         |

---

## 3. Usage Example

```jsx
import { Message } from '@/components/ai-elements/message/message';

export default function RenderChatMessage({ msg, isCurrentlyStreaming }) {
    return (
        <Message
            role={msg.role}
            content={msg.content}
            isStreaming={isCurrentlyStreaming && msg.role === 'assistant'}
        />
    );
}
```
