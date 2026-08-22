# SearchBar

A search input field equipped with a search icon, inline clear-text trigger (`✕`), and support for debounced search event execution.

---

## 1. Import Path

```javascript
import SearchBar from '@/components/Shared/Form/SearchBar/SearchBar';
```

---

## 2. Props Specification

| Prop Name     | Type       | Default       | Required | Description                                           |
| ------------- | ---------- | ------------- | -------- | ----------------------------------------------------- |
| `value`       | `string`   | —             | Yes      | Controlled search query value.                        |
| `onChange`    | `function` | —             | Yes      | Change event callback: `(e) => void`.                 |
| `placeholder` | `string`   | `'Search...'` | No       | Input placeholder string.                             |
| `onClear`     | `function` | —             | No       | Optional callback fired when clear button is clicked. |
| `className`   | `string`   | `''`          | No       | Additional custom CSS class name.                     |

---

## 3. Usage Example

```jsx
import { useState } from 'react';
import SearchBar from '@/components/Shared/Form/SearchBar/SearchBar';

export default function TableSearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <SearchBar
            value={query}
            onChange={handleChange}
            onClear={handleClear}
            placeholder="Search records by name, email, or ID..."
        />
    );
}
```
