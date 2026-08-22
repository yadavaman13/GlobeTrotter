# PromptInput (AI Element)

A feature-rich multi-line chat prompt input bar supporting voice input triggers, drag-and-drop file attachments, Enter-to-send keyboard shortcuts, and stream cancellation buttons.

---

## 1. Import Path

```javascript
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
} from "@/components/ai-elements/prompt-input/prompt-input";
```

---

## 2. Props Specification

| Prop Name     | Type       | Default               | Required | Description                                      |
| ------------- | ---------- | --------------------- | -------- | ------------------------------------------------ |
| `value`       | `string`   | `''`                  | Yes      | Controlled text input value.                     |
| `onChange`    | `function` | —                     | Yes      | Input change callback.                           |
| `onSubmit`    | `function` | —                     | Yes      | Form submission callback on Enter/Send.          |
| `isStreaming` | `boolean`  | `false`               | No       | When true, renders Stop button in place of Send. |
| `onStop`      | `function` | —                     | No       | Callback to abort active SSE stream.             |
| `placeholder` | `string`   | `'Ask AI Copilot...'` | No       | Placeholder string.                              |

---

## 3. Usage Example

```jsx
import { useState } from "react";
import { PromptInput } from "@/components/ai-elements/prompt-input/prompt-input";
import { useChat } from "@/app/features/ai/hooks/useChat";

export default function ChatBar() {
  const { sendMessage, isStreaming, stopStream } = useChat();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <PromptInput
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onSubmit={handleSend}
      isStreaming={isStreaming}
      onStop={stopStream}
      placeholder="Ask anything about your Odoo CRM deals..."
    />
  );
}
```
