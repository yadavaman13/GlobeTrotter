# Master Components Catalog & Quick Index

This document provides a searchable directory of all reusable UI primitives (`@/components/Shared/`) and AI components (`@/components/ai-elements/`) in the **Apex Template**.

---

## 1. Quick Navigation Matrix

```
components/
├── buttons/         (12 components)
├── form/            (15 components)
├── data-display/    (26 components)
├── feedback/        (8 components)
├── navigation/      (6 components)
├── error-pages/     (3 components)
├── hero-panel/      (1 component)
└── ai-elements/     (10 components)
```

---

## 2. Buttons (`components/buttons/`)

| Component             | Path                                                              | Description                                                             | Documentation                                                   |
| --------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Button**            | `@/components/Shared/Buttons/Button/Button`                       | Primary/secondary action button with loading, variants, and shine hover | [Button.md](components/buttons/Button.md)                       |
| **AIAssistantButton** | `@/components/Shared/Buttons/AIAssistantButton/AIAssistantButton` | Glowing AI action trigger button                                        | [AIAssistantButton.md](components/buttons/AIAssistantButton.md) |
| **CancelButton**      | `@/components/Shared/Buttons/CancelButton/CancelButton`           | Standard neutral cancellation button                                    | [CancelButton.md](components/buttons/CancelButton.md)           |
| **ClearAllButton**    | `@/components/Shared/Buttons/ClearAllButton/ClearAllButton`       | Filter/form reset trigger button                                        | [ClearAllButton.md](components/buttons/ClearAllButton.md)       |
| **DeleteButton**      | `@/components/Shared/Buttons/DeleteButton/DeleteButton`           | Destructive action button with danger styling                           | [DeleteButton.md](components/buttons/DeleteButton.md)           |
| **EditButton**        | `@/components/Shared/Buttons/EditButton/EditButton`               | Edit trigger button with pencil icon                                    | [EditButton.md](components/buttons/EditButton.md)               |
| **IconButton**        | `@/components/Shared/Buttons/IconButton/IconButton`               | Compact icon-only button with circular/square variants                  | [IconButton.md](components/buttons/IconButton.md)               |
| **NextButton**        | `@/components/Shared/Buttons/NextButton/NextButton`               | Wizard and pagination forward chevron trigger                           | [NextButton.md](components/buttons/NextButton.md)               |
| **PrevButton**        | `@/components/Shared/Buttons/PrevButton/PrevButton`               | Wizard and pagination back chevron trigger                              | [PrevButton.md](components/buttons/PrevButton.md)               |
| **SaveDetailsButton** | `@/components/Shared/Buttons/SaveDetailsButton/SaveDetailsButton` | Primary save/submit trigger with success styling                        | [SaveDetailsButton.md](components/buttons/SaveDetailsButton.md) |
| **ToggleButton**      | `@/components/Shared/Buttons/ToggleButton/ToggleButton`           | Controlled animated toggle/switch control                               | [ToggleButton.md](components/buttons/ToggleButton.md)           |
| **ViewToggle**        | `@/components/Shared/Buttons/ViewToggle/ViewToggle`               | Segmented Table \| Grid view mode toggle                                | [ViewToggle.md](components/buttons/ViewToggle.md)               |

---

## 3. Form Controls (`components/form/`)

| Component               | Path                                                               | Description                                                     | Documentation                                                    |
| ----------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| **InputField**          | `@/components/Shared/Form/InputField/InputField`                   | Text/password input with labels, errors, and toggle visibility  | [InputField.md](components/form/InputField.md)                   |
| **Textarea**            | `@/components/Shared/Form/Textarea/Textarea`                       | Multi-line text area with auto-resize & character count         | [Textarea.md](components/form/Textarea.md)                       |
| **Dropdown**            | `@/components/Shared/Form/Dropdown/Dropdown`                       | Custom styled select dropdown with keyboard support             | [Dropdown.md](components/form/Dropdown.md)                       |
| **DropdownMenu**        | `@/components/Shared/Form/DropdownMenu/DropdownMenu`               | Floating context menu with selectable action items              | [DropdownMenu.md](components/form/DropdownMenu.md)               |
| **DatePicker**          | `@/components/Shared/Form/DatePicker/DatePicker`                   | Date input box with popover calendar picker                     | [DatePicker.md](components/form/DatePicker.md)                   |
| **DateTimePicker**      | `@/components/Shared/Form/DateTimePicker/DateTimePicker`           | Combined date & time selection control                          | [DateTimePicker.md](components/form/DateTimePicker.md)           |
| **Calendar**            | `@/components/Shared/Form/Calendar/Calendar`                       | Standalone month grid calendar widget                           | [Calendar.md](components/form/Calendar.md)                       |
| **Checkbox**            | `@/components/Shared/Form/Checkbox/Checkbox`                       | Custom styled accessible checkbox input                         | [Checkbox.md](components/form/Checkbox.md)                       |
| **SearchBar**           | `@/components/Shared/Form/SearchBar/SearchBar`                     | Search input field with clear trigger & debouncing support      | [SearchBar.md](components/form/SearchBar.md)                     |
| **Upload**              | `@/components/Shared/Form/Upload/Upload`                           | Drag-and-drop file upload target zone                           | [Upload.md](components/form/Upload.md)                           |
| **InputGroup**          | `@/components/Shared/Form/InputGroup/InputGroup`                   | Grouped inputs with prefix/suffix action attachments            | [InputGroup.md](components/form/InputGroup.md)                   |
| **OtpInput**            | `@/components/Shared/Form/OtpInput/OtpInput`                       | Multi-cell OTP code input with auto-focus shifting              | [OtpInput.md](components/form/OtpInput.md)                       |
| **OtpVerificationForm** | `@/components/Shared/Form/OtpVerificationForm/OtpVerificationForm` | Complete 6-digit OTP verification card with live cooldown timer | [OtpVerificationForm.md](components/form/OtpVerificationForm.md) |
| **RoleSelector**        | `@/components/Shared/Form/RoleSelector/RoleSelector`               | Visual RBAC role selector cards                                 | [RoleSelector.md](components/form/RoleSelector.md)               |
| **Command**             | `@/components/Shared/Form/Command/Command`                         | Command search menu with quick keyboard actions                 | [Command.md](components/form/Command.md)                         |

---

## 4. Data Display (`components/data-display/`)

| Component                  | Path                                                                | Description                                                                                                      | Documentation                                                                  |
| -------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **AdvancedTable**          | `@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable`       | Modular minimal-by-default table with Sort dropdown, Serial #, Grid toggle, filters, search, selection, & export | [AdvancedTable.md](components/data-display/AdvancedTable.md)                   |
| **DataTable**              | `@/components/Shared/DataDisplay/DataTable/DataTable`               | Standard structured data grid                                                                                    | [DataTable.md](components/data-display/DataTable.md)                           |
| **DataView**               | `@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable`       | _(Unified into AdvancedTable — use showViewToggle prop)_                                                         | [DataView.md](components/data-display/DataView.md)                             |
| **FilterTable**            | `@/components/Shared/DataDisplay/FilterTable/FilterTable`           | Data table with built-in filter pills & search bar                                                               | [FilterTable.md](components/data-display/FilterTable.md)                       |
| **StatCard**               | `@/components/Shared/DataDisplay/StatCard/StatCard`                 | KPI metric summary card with icons and trends                                                                    | [StatCard.md](components/data-display/StatCard.md)                             |
| **MetricCard**             | `@/components/Shared/DataDisplay/MetricCard/MetricCard`             | Numerical metric card with customizable badges                                                                   | [MetricCard.md](components/data-display/MetricCard.md)                         |
| **KpiLineChartCard**       | `@/components/Shared/DataDisplay/KpiLineChartCard/KpiLineChartCard` | Dedicated metric trend chart card                                                                                | [KpiLineChartCard.md](components/data-display/KpiLineChartCard.md)             |
| **AnalyticsLineChartCard** | `@/components/Shared/AnalyticsLineChartCard/AnalyticsLineChartCard` | Reusable analytics line chart card with header & metric values                                                   | [AnalyticsLineChartCard.md](components/data-display/AnalyticsLineChartCard.md) |
| **KanbanBoard**            | `@/components/Shared/DataDisplay/KanbanBoard/KanbanBoard`           | Interactive drag-and-drop task status board                                                                      | [KanbanBoard.md](components/data-display/KanbanBoard.md)                       |
| **ActivitiesFeed**         | `@/components/Shared/DataDisplay/ActivitiesFeed/ActivitiesFeedCard` | Live activity event feed with user avatars                                                                       | [ActivitiesFeed.md](components/data-display/ActivitiesFeed.md)                 |
| **Timeline**               | `@/components/Shared/DataDisplay/Timeline/Timeline`                 | Vertical milestone and audit trail timeline                                                                      | [Timeline.md](components/data-display/Timeline.md)                             |
| **Badge**                  | `@/components/Shared/DataDisplay/Badge/Badge`                       | Status pills, tags, and category chips                                                                           | [Badge.md](components/data-display/Badge.md)                                   |
| **VerticalBadge**          | `@/components/Shared/DataDisplay/VerticalBadge/VerticalBadge`       | Vertical status stripe indicator                                                                                 | [VerticalBadge.md](components/data-display/VerticalBadge.md)                   |
| **CircularAvatar**         | `@/components/Shared/DataDisplay/CircularAvatar/CircularAvatar`     | Circular user profile avatar with fallback initials                                                              | [CircularAvatar.md](components/data-display/CircularAvatar.md)                 |
| **Card**                   | `@/components/Shared/DataDisplay/Card/Card`                         | General-purpose elevated card container                                                                          | [Card.md](components/data-display/Card.md)                                     |
| **Accordion**              | `@/components/Shared/DataDisplay/Accordion/Accordion`               | Collapsible accordion sections                                                                                   | [Accordion.md](components/data-display/Accordion.md)                           |
| **Collapsible**            | `@/components/Shared/DataDisplay/Collapsible/Collapsible`           | Expandable disclosure container                                                                                  | [Collapsible.md](components/data-display/Collapsible.md)                       |
| **Carousel**               | `@/components/Shared/DataDisplay/Carousel/Carousel`                 | Interactive slider component                                                                                     | [Carousel.md](components/data-display/Carousel.md)                             |
| **EmptyState**             | `@/components/Shared/DataDisplay/EmptyState/EmptyState`             | Empty state placeholder with graphic and action CTA                                                              | [EmptyState.md](components/data-display/EmptyState.md)                         |
| **EmptyStateCard**         | `@/components/Shared/DataDisplay/EmptyStateCard/EmptyStateCard`     | Boxed card empty state                                                                                           | [EmptyStateCard.md](components/data-display/EmptyStateCard.md)                 |
| **ProgressBar**            | `@/components/Shared/DataDisplay/ProgressBar/ProgressBar`           | Linear percentage progress indicator                                                                             | [ProgressBar.md](components/data-display/ProgressBar.md)                       |
| **StepProgress**           | `@/components/Shared/DataDisplay/StepProgress/StepProgress`         | Multi-step form/wizard indicator                                                                                 | [StepProgress.md](components/data-display/StepProgress.md)                     |
| **Tooltip**                | `@/components/Shared/DataDisplay/Tooltip/Tooltip`                   | Accessible hover popover tooltip                                                                                 | [Tooltip.md](components/data-display/Tooltip.md)                               |
| **Logo**                   | `@/components/Shared/DataDisplay/Logo/Logo`                         | Responsive application brand logo                                                                                | [Logo.md](components/data-display/Logo.md)                                     |
| **FormHeader**             | `@/components/Shared/DataDisplay/FormHeader/FormHeader`             | Clean title & subtitle header for forms and pages                                                                | [FormHeader.md](components/data-display/FormHeader.md)                         |

---

## 5. Feedback & Overlays (`components/feedback/`)

| Component          | Path                                                         | Description                                                       | Documentation                                              |
| ------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| **Dialog**         | `@/components/Shared/Feedback/Dialog/Dialog`                 | Modal dialog box with backdrop blur and focus trap                | [Dialog.md](components/feedback/Dialog.md)                 |
| **Toast**          | `@/components/Shared/Feedback/Toast/Toast`                   | Floating system notification toast                                | [Toast.md](components/feedback/Toast.md)                   |
| **DeleteToast**    | `@/components/Shared/Feedback/DeleteToast/DeleteToast`       | Destructive action confirmation toast                             | [DeleteToast.md](components/feedback/DeleteToast.md)       |
| **Drawer**         | `@/components/Shared/Feedback/Drawer/Drawer`                 | Slide-in side drawer panel                                        | [Drawer.md](components/feedback/Drawer.md)                 |
| **Popover**        | `@/components/Shared/Feedback/Popover/Popover`               | Triggered overlay popup container                                 | [Popover.md](components/feedback/Popover.md)               |
| **Alert**          | `@/components/Shared/Feedback/Alert/Alert`                   | Inline status notification banner (info, success, warning, error) | [Alert.md](components/feedback/Alert.md)                   |
| **Spinner**        | `@/components/Shared/Feedback/Spinner/Spinner`               | Smooth loading spinner indicator                                  | [Spinner.md](components/feedback/Spinner.md)               |
| **TabSwitchModal** | `@/components/Shared/Feedback/TabSwitchModal/TabSwitchModal` | Unsaved changes confirmation modal                                | [TabSwitchModal.md](components/feedback/TabSwitchModal.md) |

---

## 6. Navigation (`components/navigation/`)

| Component       | Path                                                     | Description                                                 | Documentation                                          |
| --------------- | -------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| **Sidebar**     | `@/components/Shared/Navigation/Sidebar/Sidebar`         | Collapsible main navigation sidebar with flyout sub-tabs    | [Sidebar.md](components/navigation/Sidebar.md)         |
| **Topbar**      | `@/components/Shared/Navigation/Topbar/Topbar`           | Top header bar with breadcrumbs, notifications, and profile | [Topbar.md](components/navigation/Topbar.md)           |
| **Pagination**  | `@/components/Shared/Navigation/Pagination/Pagination`   | Page navigation controls with page size selector            | [Pagination.md](components/navigation/Pagination.md)   |
| **TableTabs**   | `@/components/Shared/Navigation/TableTabs/TableTabs`     | Filter tab bar for tables and datasets                      | [TableTabs.md](components/navigation/TableTabs.md)     |
| **TabPills**    | `@/components/Shared/Navigation/TabPills/TabPills`       | Pill-style navigation switchers                             | [TabPills.md](components/navigation/TabPills.md)       |
| **Breadcrumbs** | `@/components/Shared/Navigation/Breadcrumbs/Breadcrumbs` | Hierarchy path trail navigation                             | [Breadcrumbs.md](components/navigation/Breadcrumbs.md) |

---

## 7. Error Pages (`components/error-pages/`)

| Component           | Path                                                             | Description                                  | Documentation                                                   |
| ------------------- | ---------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| **ForbiddenPage**   | `@/components/Shared/ErrorPages/ForbiddenPage/ForbiddenPage`     | 403 Access Denied view with back-to-home CTA | [ForbiddenPage.md](components/error-pages/ForbiddenPage.md)     |
| **NotFoundPage**    | `@/components/Shared/ErrorPages/NotFoundPage/NotFoundPage`       | 404 Page Not Found view                      | [NotFoundPage.md](components/error-pages/NotFoundPage.md)       |
| **ServerErrorPage** | `@/components/Shared/ErrorPages/ServerErrorPage/ServerErrorPage` | 500 Internal Server Error view               | [ServerErrorPage.md](components/error-pages/ServerErrorPage.md) |

---

## 8. Hero Panel (`components/hero-panel/`)

| Component     | Path                                      | Description                                      | Documentation                                      |
| ------------- | ----------------------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| **HeroPanel** | `@/components/Shared/HeroPanel/HeroPanel` | Visual branding split-panel used in auth layouts | [HeroPanel.md](components/hero-panel/HeroPanel.md) |

---

## 9. AI Elements (`components/ai-elements/`)

| Component        | Path                                                 | Description                                               | Documentation                                             |
| ---------------- | ---------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| **Attachments**  | `@/components/ai-elements/attachments/attachments`   | Uploaded document & image chip list in chat               | [Attachments.md](components/ai-elements/Attachments.md)   |
| **CodeBlock**    | `@/components/ai-elements/code-block/code-block`     | Syntax-highlighted code container with copy button        | [CodeBlock.md](components/ai-elements/CodeBlock.md)       |
| **Confirmation** | `@/components/ai-elements/confirmation/confirmation` | Interactive tool execution confirmation prompt            | [Confirmation.md](components/ai-elements/Confirmation.md) |
| **Conversation** | `@/components/ai-elements/conversation/conversation` | Main chat stream wrapper with smart auto-scroll           | [Conversation.md](components/ai-elements/Conversation.md) |
| **Message**      | `@/components/ai-elements/message/message`           | User/Assistant chat bubble with markdown & markdown math  | [Message.md](components/ai-elements/Message.md)           |
| **PromptInput**  | `@/components/ai-elements/prompt-input/prompt-input` | Rich multi-line chat input with voice and file drop       | [PromptInput.md](components/ai-elements/PromptInput.md)   |
| **Sources**      | `@/components/ai-elements/sources/sources`           | Collapsible RAG retrieval vector citations & sources list | [Sources.md](components/ai-elements/Sources.md)           |
| **SpeechInput**  | `@/components/ai-elements/speech-input/speech-input` | Voice-to-text audio recording button                      | [SpeechInput.md](components/ai-elements/SpeechInput.md)   |
| **Suggestion**   | `@/components/ai-elements/suggestion/suggestion`     | Suggested quick-action question pills                     | [Suggestion.md](components/ai-elements/Suggestion.md)     |
| **Tool**         | `@/components/ai-elements/tool/tool`                 | Tool execution progress indicator and payload viewer      | [Tool.md](components/ai-elements/Tool.md)                 |
