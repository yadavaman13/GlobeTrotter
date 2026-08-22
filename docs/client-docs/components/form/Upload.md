# Upload

A drag-and-drop file upload target zone supporting file size validation, mime-type filtering, file selection previews, and upload progress spinners.

---

## 1. Import Path

```javascript
import Upload from '@/components/Shared/Form/Upload/Upload';
```

---

## 2. Props Specification

| Prop Name         | Type       | Default                                 | Required | Description                                                                   |
| ----------------- | ---------- | --------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| `onFilesSelected` | `function` | —                                       | Yes      | Callback fired when files are dropped or selected: `(files: File[]) => void`. |
| `accept`          | `string`   | `'*'`                                   | No       | Accepted file types (e.g. `'.pdf, .csv, image/*'`).                           |
| `multiple`        | `boolean`  | `false`                                 | No       | Allows multiple file uploads simultaneously.                                  |
| `maxSizeMB`       | `number`   | `10`                                    | No       | Maximum allowed file size limit in megabytes.                                 |
| `disabled`        | `boolean`  | `false`                                 | No       | Disables file drop and input clicks.                                          |
| `label`           | `string`   | `'Drag and drop files here, or browse'` | No       | Instructions label text.                                                      |
| `className`       | `string`   | `''`                                    | No       | Additional custom CSS class name.                                             |

---

## 3. Usage Example

```jsx
import Upload from '@/components/Shared/Form/Upload/Upload';

export default function DocumentUploader({ onUploadDocs }) {
    return (
        <Upload
            accept=".pdf,.doc,.docx"
            multiple
            maxSizeMB={20}
            onFilesSelected={onUploadDocs}
            label="Upload CRM Contract / Invoices (PDF, max 20MB)"
        />
    );
}
```
