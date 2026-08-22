# Sources (AI Element)

A collapsible citation and document vector source viewer component rendering search engine URLs, parsed PDF pages, and Pinecone vector chunks cited in RAG responses.

---

## 1. Import Path

```javascript
import { Sources, SourceItem } from "@/components/ai-elements/sources/sources";
```

---

## 2. Props Specification

| Prop Name   | Type                                                                       | Default | Required | Description                   |
| ----------- | -------------------------------------------------------------------------- | ------- | -------- | ----------------------------- |
| `sources`   | `Array<{ title: string, url?: string, score?: number, snippet?: string }>` | `[]`    | Yes      | List of cited RAG references. |
| `className` | `string`                                                                   | `''`    | No       | Custom CSS class name.        |

---

## 3. Usage Example

```jsx
import { Sources } from "@/components/ai-elements/sources/sources";

export default function CitedSources({ citedDocuments }) {
  if (!citedDocuments || citedDocuments.length === 0) return null;

  return <Sources sources={citedDocuments} />;
}
```
