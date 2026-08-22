# Attachments (AI Element)

A chip list component rendering uploaded files, PDF documents, and image thumbnails within the AI prompt input and message bubbles.

---

## 1. Import Path

```javascript
import { Attachments, AttachmentItem } from '@/components/ai-elements/attachments/attachments';
```

---

## 2. Props Specification

| Prop Name     | Type                                                                              | Default | Required | Description                                                         |
| ------------- | --------------------------------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------- |
| `attachments` | `Array<{ id: string, name: string, size?: string, type?: string, url?: string }>` | `[]`    | Yes      | List of attached files.                                             |
| `onRemove`    | `function`                                                                        | —       | No       | Callback when remove (✕) button on chip is clicked: `(id) => void`. |
| `readOnly`    | `boolean`                                                                         | `false` | No       | Hides delete buttons when rendering inside historical messages.     |

---

## 3. Usage Example

```jsx
import { Attachments } from '@/components/ai-elements/attachments/attachments';

export default function AttachedFilesList({ files, handleRemoveFile }) {
    return <Attachments attachments={files} onRemove={handleRemoveFile} />;
}
```
