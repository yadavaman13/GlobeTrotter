# Frontend Agent Playbook: Architecture & Development Guidelines

This document serves as an end-to-end guide for AI coding agents and developers working on the **Apex Template** frontend client. Follow these guidelines to maintain structural integrity, 4-layer separation, routing conventions, and high-performance design patterns.

---

## 1. Quick Documentation Directory

| Document                                                     | Purpose                                                              |
| ------------------------------------------------------------ | -------------------------------------------------------------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md)                           | Official **4-Layer Architecture** (`UI` → `Hooks` → `State` → `API`) |
| [FEATURE_DEVELOPMENT_GUIDE.md](FEATURE_DEVELOPMENT_GUIDE.md) | Step-by-step recipe for building and registering new features        |
| [DESIGN_SYSTEM_SCSS.md](DESIGN_SYSTEM_SCSS.md)               | 3-Tier Design Tokens, SCSS `@use`, and zero-`!important` rules       |
| [COMPONENTS_CATALOG.md](COMPONENTS_CATALOG.md)               | Master directory and prop reference for 60+ shared primitives        |
| [ChartsGuide.md](ChartsGuide.md)                             | Data visualization and chart selection trees                         |
| [ChartsMetaData.md](ChartsMetaData.md)                       | Interactive chart configurations and tooltips                        |
| [ValidationGuide.md](ValidationGuide.md)                     | Frontend form validation with Zod and error displays                 |

---

## 2. Directory Layout & Organization

All client application files are housed within `client/src/`:

```
src/
├── main.jsx                  <-- Application Entry Point
├── index.scss                <-- Global resets and foundation CSS imports
├── styles/                   <-- Sass tokens and variable bridge
│   ├── foundation/tokens/    <-- Tier 1: Primitives (:root raw values)
│   ├── foundation/themes/    <-- Tier 2: Semantic themes (Light & Dark)
│   └── variables.scss        <-- Tier 3: Sass variable bridge
│
├── app/                      <-- Core Application Architecture
│   ├── App.jsx               <-- Root Layout Wrapper containing <Outlet />
│   ├── App.routes.jsx        <-- React Router v7 child routes configuration
│   └── features/             <-- Feature Modules (4-Layer Model)
│       ├── auth/             <-- Login, Register, Recovery flows
│       ├── dashboard/        <-- Sidebar, Topbar, Main Content Outlet
│       ├── analytics/        <-- Insights and Reports views
│       ├── settings/         <-- Account & General preference panels
│       ├── showcase/         <-- ComponentsShowcase interactive gallery
│       └── ai/               <-- AI Copilot chat (SSE streams & External Stores)
│
├── components/
│   ├── Shared/               <-- Reusable presentational design system primitives
│   │   ├── Buttons/          <-- Button, ToggleButton, ViewToggle, etc.
│   │   ├── Form/             <-- InputField, Textarea, Dropdown, DatePicker, etc.
│   │   ├── DataDisplay/      <-- AdvancedTable (Table & Grid modes), StatCard, Kanban, etc.
│   │   ├── Feedback/         <-- Dialog, Toast, DeleteToast, Drawer, Popover, etc.
│   │   ├── Navigation/       <-- Sidebar, Topbar, Pagination, TableTabs, etc.
│   │   ├── ErrorPages/       <-- 403, 404, 500 status views
│   │   └── HeroPanel/        <-- Auth branding panel
│   └── ai-elements/          <-- Message, PromptInput, Conversation, Tool, etc.
│
├── hooks/                    <-- Global utility React hooks
├── lib/                      <-- Utility libraries (clsx, tailwind-merge)
└── utils/                    <-- Formatting and calculation helpers
```

---

## 3. Core Coding Conventions

### A. Strict 4-Layer Separation

When working on features in `src/app/features/`:

1. **UI Layer (`pages/`, `components/`)**: Declarative JSX only. Calls hooks. Never calls `axios` directly.
2. **Hooks Layer (`hooks/`)**: Orchestrates API requests, manages loading/error transitions, writes into State.
3. **State Layer (`context/` or `store/`)**: Holds reactive data and exposes setters. Never contains async logic or HTTP calls.
4. **API Layer (`services/`)**: Pure Axios / Fetch infrastructure. Never contains React hooks or state updates.

### B. Shared Component Reusability

- Always inspect [COMPONENTS_CATALOG.md](COMPONENTS_CATALOG.md) before creating new visual elements.
- Never write raw HTML buttons or unstyled inputs. Use `@/components/Shared/` primitives.

### C. SCSS Styling Tokens

- Always import variables via `@use '@/styles/variables' as variables;`.
- Never hardcode raw hex codes or pixels.
- Use native `color-mix()` for shading.
- Enforce the **Zero-`!important` rule**.

---

## 4. Performance Guidelines for Hackathons

1. **Input Debouncing**: Run search filters through a 300ms debounce loop before updating filter state.
2. **Row Memoization**: Wrap repeating table/grid rows in `React.memo` and pass callbacks wrapped in `useCallback`.
3. **External Store for AI Streams**: Real-time SSE token streaming uses `useSyncExternalStore` in `src/app/features/ai/store/chatStore.js` to avoid re-rendering entire React trees.
