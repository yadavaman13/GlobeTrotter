# Textarea

A multi-line text input field matching the design language of `InputField`. Supports auto-resizing, character counters, warning thresholds, hint text, and error states.

---

## 1. Import Path

```javascript
import Textarea from '@/components/Shared/Form/Textarea/Textarea';
```

---

## 2. Props Specification

| Prop Name     | Type                                             | Default      | Required | Description                                                   |
| ------------- | ------------------------------------------------ | ------------ | -------- | ------------------------------------------------------------- |
| `label`       | `string`                                         | —            | No       | Label rendered above the textarea.                            |
| `id`          | `string`                                         | —            | No       | Element ID linked with label `htmlFor`.                       |
| `placeholder` | `string`                                         | —            | No       | Placeholder text.                                             |
| `value`       | `string`                                         | `''`         | No       | Controlled textarea text string.                              |
| `onChange`    | `function`                                       | —            | Yes      | Change event callback.                                        |
| `rows`        | `number`                                         | `4`          | No       | Initial visible row count.                                    |
| `maxLength`   | `number`                                         | —            | No       | Maximum permitted character length (triggers live counter).   |
| `resize`      | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | No       | CSS resize handle mode.                                       |
| `autoResize`  | `boolean`                                        | `false`      | No       | Automatically adjusts height to fit text content dynamically. |
| `error`       | `string`                                         | —            | No       | Error message text.                                           |
| `hint`        | `string`                                         | —            | No       | Helper hint text rendered in footer when there is no error.   |
| `disabled`    | `boolean`                                        | `false`      | No       | Disables input.                                               |
| `required`    | `boolean`                                        | `false`      | No       | Renders a required red asterisk next to label.                |
| `className`   | `string`                                         | `''`         | No       | Additional custom CSS class name.                             |

---

## 3. Usage Example

```jsx
import { useState } from 'react';
import Textarea from '@/components/Shared/Form/Textarea/Textarea';

export default function FeedbackForm() {
    const [comments, setComments] = useState('');

    return (
        <Textarea
            label="Feedback & Notes"
            id="user-feedback"
            placeholder="Share your experience or bug report..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            maxLength={500}
            autoResize
            hint="Maximum 500 characters"
            required
        />
    );
}
```
