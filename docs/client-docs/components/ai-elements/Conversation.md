# Conversation (AI Element)

The core chat viewport container managing message scroll pinning, auto-scroll to bottom during active token streams, scroll-to-bottom buttons, and empty conversation states.

---

## 1. Import Path

```javascript
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation/conversation";
```

---

## 2. Props Specification

| Prop Name       | Type        | Default | Required | Description                                                      |
| --------------- | ----------- | ------- | -------- | ---------------------------------------------------------------- |
| `children`      | `ReactNode` | —       | Yes      | Stream messages and subcomponents.                               |
| `chatId`        | `string`    | —       | No       | Current conversation ID (triggers bottom scroll on change).      |
| `messagesCount` | `number`    | `0`     | No       | Total count of messages (triggers auto-scroll when incremented). |
| `className`     | `string`    | `''`    | No       | Custom CSS class name.                                           |

---

## 3. Usage Example

```jsx
import {
  Conversation,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation/conversation";
import { Message } from "@/components/ai-elements/message/message";

export default function ChatWindow({ messages, activeChatId }) {
  return (
    <Conversation chatId={activeChatId} messagesCount={messages.length}>
      {messages.map((msg) => (
        <Message key={msg.id} role={msg.role} content={msg.content} />
      ))}
      <ConversationScrollButton />
    </Conversation>
  );
}
```
