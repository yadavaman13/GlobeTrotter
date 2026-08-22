# DropdownMenu

A floating contextual action menu that anchors to a trigger button, providing actions like editing, exporting, duplicating, or deleting.

---

## 1. Import Path

```javascript
import DropdownMenu from "@/components/Shared/Form/DropdownMenu/DropdownMenu";
```

---

## 2. Props Specification

| Prop Name   | Type                                                                                                  | Default   | Required | Description                                        |
| ----------- | ----------------------------------------------------------------------------------------------------- | --------- | -------- | -------------------------------------------------- |
| `trigger`   | `ReactNode`                                                                                           | —         | Yes      | Element that opens the dropdown menu when clicked. |
| `items`     | `Array<{ label: string, icon?: Component, onClick: function, danger?: boolean, disabled?: boolean }>` | `[]`      | Yes      | List of menu items.                                |
| `align`     | `'left' \| 'right'`                                                                                   | `'right'` | No       | Alignment of popover menu relative to trigger.     |
| `className` | `string`                                                                                              | `''`      | No       | Additional custom CSS class name.                  |

---

## 3. Usage Example

```jsx
import DropdownMenu from "@/components/Shared/Form/DropdownMenu/DropdownMenu";
import IconButton from "@/components/Shared/Buttons/IconButton/IconButton";
import { MoreVertical, Edit, Trash2, Download } from "lucide-react";

export default function RowActionMenu({ item, onEdit, onDelete, onExport }) {
  const menuItems = [
    { label: "Edit Details", icon: Edit, onClick: () => onEdit(item) },
    { label: "Export PDF", icon: Download, onClick: () => onExport(item) },
    {
      label: "Delete Record",
      icon: Trash2,
      danger: true,
      onClick: () => onDelete(item),
    },
  ];

  return (
    <DropdownMenu
      trigger={
        <IconButton ariaLabel="More options" variant="ghost" size="sm">
          <MoreVertical size={16} />
        </IconButton>
      }
      items={menuItems}
    />
  );
}
```
