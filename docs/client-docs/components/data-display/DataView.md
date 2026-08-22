# DataView (Deprecated / Unified into AdvancedTable)

> [!NOTE]
> `DataView` has been consolidated directly into [AdvancedTable](AdvancedTable.md). `AdvancedTable` now natively supports table/grid view switching, card grid rendering, and all modular table features via boolean flags.

---

## 1. Migration to AdvancedTable

Instead of using `DataView`, import and use `AdvancedTable` with `showViewToggle={true}`:

```diff
- import DataView from '@/components/Shared/DataDisplay/DataView/DataView';
+ import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';

- <DataView
+ <AdvancedTable
+     showViewToggle={true}
      defaultViewMode="grid"
      columns={columns}
      data={data}
      gridColumns={4}
      cardTitleKey="name"
      cardSubtitleKey="role"
      cardStatusKey="status"
      cardBodyKeys={['email', 'department']}
  />
```

---

## 2. AdvancedTable Grid View Capabilities

When `showViewToggle={true}` or `viewMode="grid"`, `AdvancedTable` renders responsive cards utilizing the built-in `GridView` and `GridCard` subcomponents.

| Prop Name          | Type                | Default   | Description                                                                         |
| :----------------- | :------------------ | :-------- | :---------------------------------------------------------------------------------- |
| `showViewToggle`   | `boolean`           | `false`   | Displays the Table / Grid segmented switch button in the header actions.            |
| `defaultViewMode`  | `'table' \| 'grid'` | `'table'` | Initial active view mode.                                                           |
| `viewMode`         | `'table' \| 'grid'` | `null`    | Controlled active view mode.                                                        |
| `gridColumns`      | `number`            | `4`       | Number of columns in responsive card grid (1 on mobile, 2 on tablet, 4 on desktop). |
| `cardTitleKey`     | `string`            | —         | Row object key used as card title heading.                                          |
| `cardSubtitleKey`  | `string`            | —         | Row object key used as card subtitle.                                               |
| `cardImageKey`     | `string`            | —         | Row object key containing avatar image URL.                                         |
| `cardStatusKey`    | `string`            | —         | Row object key rendered as status Badge pill.                                       |
| `cardBodyKeys`     | `Array<string>`     | `[]`      | Row object keys displayed as label:value rows in the card body.                     |
| `statusVariantMap` | `object`            | `{}`      | Map of status strings to Badge variants.                                            |
| `onCardClick`      | `function`          | `null`    | Callback triggered when a card is clicked: `(row) => void`.                         |
| `renderCard`       | `function`          | `null`    | Custom JSX card renderer: `(row, columns) => JSX`.                                  |

For complete documentation on all table features and boolean flags, see [AdvancedTable.md](AdvancedTable.md).
