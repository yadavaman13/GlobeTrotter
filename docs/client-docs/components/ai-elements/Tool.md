# Tool (AI Element)

A tool execution status step and collapsible payload inspector component displaying real-time agent tool-calling states (`searching`, `reading_db`, `calculating_pdf`).

---

## 1. Import Path

```javascript
import { Tool, ToolHeader, ToolContent } from '@/components/ai-elements/tool/tool';
```

---

## 2. Props Specification

| Prop Name | Type                                  | Default     | Required | Description                                       |
| --------- | ------------------------------------- | ----------- | -------- | ------------------------------------------------- |
| `name`    | `string`                              | —           | Yes      | Tool function name (e.g. `'odoo_crm_retriever'`). |
| `status`  | `'running' \| 'completed' \| 'error'` | `'running'` | Yes      | Execution status state.                           |
| `input`   | `object \| string`                    | —           | No       | Tool arguments input.                             |
| `output`  | `object \| string`                    | —           | No       | Tool execution result output.                     |

---

## 3. Usage Example

```jsx
import { Tool } from '@/components/ai-elements/tool/tool';

export default function AgentToolStep({ step }) {
    return <Tool name={step.tool} status={step.status} input={step.args} output={step.result} />;
}
```
