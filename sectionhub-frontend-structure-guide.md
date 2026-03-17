# SectionHub Frontend Structure Guide

## Project goal

This guide defines the **frontend structure** for SectionHub so the project stays:

- readable
- reusable
- scalable
- easy to maintain page by page

We are organizing this as a **Next.js + Tailwind CSS** admin application with a strong focus on:

- shared UI primitives
- small reusable components
- page-level composition
- centralized theme tokens
- consistent naming
- easy handoff from generated HTML/Tailwind into production code

This structure is based on the SectionHub admin product modules and workflows described in the architecture guide. fileciteturn0file0L1-L19 fileciteturn0file0L17-L19

---

## Core stack

- **Next.js (App Router)**
- **Tailwind CSS**
- **TypeScript**
- **Lucide React**
- **Global CSS theme tokens**
- Later we can add:
  - React Hook Form
  - Zod
  - TanStack Table
  - Zustand or Redux only if needed
  - Recharts or Chart library for analytics

For now, the main job is **clean structure**, not over-engineering.

---

## Main frontend principles

### 1. Keep pages thin

Each page should mostly:

- fetch or receive data
- compose sections
- use reusable components

Pages should **not** contain long repeated UI blocks.

### 2. Reuse small pieces

Buttons, inputs, badges, cards, table wrappers, section headers, toggles, search bars, filters, and dialog shells should live in shared components.

### 3. Shared layout stays global

Sidebar, top header, page container, breadcrumbs, page heading, and auth layout should be shared.

### 4. Page-specific UI stays near the page

If a component is only used in one page or one feature, keep it inside that page folder.

### 5. All colors and fonts come from global theme

Never hardcode design colors repeatedly in pages.

### 6. Tailwind is for composition, global CSS is for tokens

- **global.css** = theme variables, fonts, reusable utility classes, app base styles
- **Tailwind classes** = layout and per-component composition

---

## Final folder structure

```txt
sectionhub/
├─ public/
│  ├─ images/
│  ├─ icons/
│  └─ logos/
│
├─ src/
│  ├─ app/
│  │  ├─ (auth)/
│  │  │  ├─ login/
│  │  │  │  └─ page.tsx
│  │  │  ├─ forgot-password/
│  │  │  │  └─ page.tsx
│  │  │  └─ reset-password/
│  │  │     └─ page.tsx
│  │  │
│  │  ├─ (dashboard)/
│  │  │  ├─ layout.tsx
│  │  │  ├─ dashboard/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components/
│  │  │  ├─ sections/
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ upload/
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ _components/
│  │  │  │  ├─ [sectionId]/
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ _components/
│  │  │  │  └─ _components/
│  │  │  ├─ bundles/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components/
│  │  │  ├─ categories/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components/
│  │  │  ├─ tags/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components/
│  │  │  ├─ analytics/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components/
│  │  │  ├─ orders/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components/
│  │  │  ├─ customers/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components/
│  │  │  ├─ activity-log/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ _components/
│  │  │  └─ settings/
│  │  │     ├─ page.tsx
│  │  │     └─ _components/
│  │  │
│  │  ├─ api/
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  │
│  ├─ components/
│  │  ├─ ui/
│  │  │  ├─ button.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ textarea.tsx
│  │  │  ├─ select.tsx
│  │  │  ├─ checkbox.tsx
│  │  │  ├─ switch.tsx
│  │  │  ├─ badge.tsx
│  │  │  ├─ card.tsx
│  │  │  ├─ table.tsx
│  │  │  ├─ dialog.tsx
│  │  │  ├─ tabs.tsx
│  │  │  ├─ empty-state.tsx
│  │  │  ├─ pagination.tsx
│  │  │  ├─ search-input.tsx
│  │  │  ├─ file-upload.tsx
│  │  │  └─ index.ts
│  │  │
│  │  ├─ shared/
│  │  │  ├─ layout/
│  │  │  │  ├─ app-sidebar.tsx
│  │  │  │  ├─ app-header.tsx
│  │  │  │  ├─ page-shell.tsx
│  │  │  │  ├─ page-header.tsx
│  │  │  │  ├─ breadcrumb.tsx
│  │  │  │  └─ auth-shell.tsx
│  │  │  │
│  │  │  ├─ feedback/
│  │  │  │  ├─ loading-state.tsx
│  │  │  │  ├─ error-state.tsx
│  │  │  │  ├─ success-state.tsx
│  │  │  │  ├─ status-pill.tsx
│  │  │  │  └─ info-note.tsx
│  │  │  │
│  │  │  ├─ data-display/
│  │  │  │  ├─ stat-card.tsx
│  │  │  │  ├─ metric-card.tsx
│  │  │  │  ├─ key-value-row.tsx
│  │  │  │  ├─ avatar-group.tsx
│  │  │  │  └─ label-value.tsx
│  │  │  │
│  │  │  ├─ form/
│  │  │  │  ├─ form-field.tsx
│  │  │  │  ├─ field-label.tsx
│  │  │  │  ├─ field-hint.tsx
│  │  │  │  ├─ field-error.tsx
│  │  │  │  ├─ section-form-card.tsx
│  │  │  │  └─ chip-input.tsx
│  │  │  │
│  │  │  └─ index.ts
│  │  │
│  │  └─ charts/
│  │     ├─ installs-bar-chart.tsx
│  │     ├─ revenue-line-chart.tsx
│  │     └─ chart-card.tsx
│  │
│  ├─ lib/
│  │  ├─ utils.ts
│  │  ├─ cn.ts
│  │  ├─ constants/
│  │  │  ├─ navigation.ts
│  │  │  ├─ section-status.ts
│  │  │  ├─ pricing.ts
│  │  │  └─ settings.ts
│  │  └─ format/
│  │     ├─ currency.ts
│  │     ├─ date.ts
│  │     ├─ slug.ts
│  │     └─ number.ts
│  │
│  ├─ types/
│  │  ├─ auth.ts
│  │  ├─ section.ts
│  │  ├─ category.ts
│  │  ├─ bundle.ts
│  │  ├─ analytics.ts
│  │  ├─ order.ts
│  │  └─ settings.ts
│  │
│  └─ data/
│     ├─ mock-dashboard.ts
│     ├─ mock-sections.ts
│     ├─ mock-categories.ts
│     ├─ mock-bundles.ts
│     └─ mock-settings.ts
│
├─ README.md
├─ components.json
├─ next.config.ts
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
└─ tsconfig.json
```

---

## App Router approach

We will use route groups:

- **(auth)** for login, forgot password, reset password
- **(dashboard)** for all authenticated admin pages

This gives us:

- shared auth layout
- shared dashboard layout
- clean separation
- easier future middleware protection

---

## Folder rule by responsibility

## 1) `src/app`

This is only for:

- routes
- page composition
- route layouts
- page-specific `_components`

### Rule

If a component is used only in one route or feature, put it inside that route's `_components` folder.

Examples:

- `src/app/(dashboard)/settings/_components/settings-general-form.tsx`
- `src/app/(dashboard)/sections/_components/sections-table.tsx`
- `src/app/(dashboard)/dashboard/_components/recent-activity-card.tsx`

---

## 2) `src/components/ui`

This folder contains **base reusable UI primitives**.

These are not business-specific.

Examples:

- Button
- Input
- Textarea
- Select
- Badge
- Card
- Table
- Tabs
- Dialog
- Pagination

### Rule

If a component can be reused in many pages without knowing business context, keep it here.

---

## 3) `src/components/shared`

This contains **project-level reusable building blocks**.

These are still reusable, but more aware of admin layout and product patterns.

Examples:

- AppSidebar
- AppHeader
- PageHeader
- AuthShell
- StatCard
- FormField
- StatusPill
- InfoNote

### Rule

If it is reusable across multiple pages but is more SectionHub-specific than raw UI, keep it here.

---

## 4) `src/lib`

This is for helper functions and constants.

Examples:

- `cn()` for class merging
- date formatters
- money formatters
- navigation config
- status maps
- app-wide constants

### Rule

No React component inside `lib`.

---

## 5) `src/types`

This keeps data shapes clean.

Examples:

- `Section`
- `Bundle`
- `Category`
- `Order`
- `Settings`

### Rule

Every major module should get its own type file.

---

## 6) `src/data`

Temporary mock data while building page-by-page from generated HTML.

Later this can be replaced by real server actions or API calls.

---

## Shared layout rules

## Dashboard layout

All non-auth pages should use the same layout shell:

- fixed sidebar
- top header
- page content area
- standard page width and spacing

Suggested composition:

```tsx
<AppShell>
  <AppSidebar />
  <MainPanel>
    <AppHeader />
    <PageShell>{children}</PageShell>
  </MainPanel>
</AppShell>
```

## Auth layout

Auth pages should use a separate shell:

- centered card
- clean soft background
- no sidebar
- no topbar

Suggested composition:

```tsx
<AuthShell>
  <LoginForm />
</AuthShell>
```

---

## Page folder rule

Each main page gets:

- `page.tsx`
- `_components/` folder only for that page's internal pieces

Examples:

### Settings page

```txt
settings/
├─ page.tsx
└─ _components/
   ├─ settings-sidebar-nav.tsx
   ├─ general-settings-card.tsx
   ├─ api-credentials-card.tsx
   ├─ maintenance-card.tsx
   └─ settings-search.tsx
```

### Sections page

```txt
sections/
├─ page.tsx
└─ _components/
   ├─ sections-toolbar.tsx
   ├─ sections-table.tsx
   ├─ sections-filters.tsx
   ├─ sections-bulk-actions.tsx
   └─ sections-empty-state.tsx
```

### Upload page

```txt
upload/
├─ page.tsx
└─ _components/
   ├─ basic-information-card.tsx
   ├─ pricing-access-card.tsx
   ├─ tags-card.tsx
   ├─ liquid-file-card.tsx
   ├─ documentation-card.tsx
   ├─ previews-card.tsx
   ├─ seo-metadata-card.tsx
   ├─ compatibility-card.tsx
   ├─ publish-card.tsx
   ├─ checklist-card.tsx
   ├─ version-history-card.tsx
   └─ danger-zone-card.tsx
```

This keeps page logic readable.

---

## Reusable component strategy

## A. Foundational UI primitives

These are the first components we should build.

- `Button`
- `Input`
- `Textarea`
- `Select`
- `Checkbox`
- `Switch`
- `Badge`
- `Card`
- `Table`
- `Dialog`
- `Tabs`
- `Pagination`

These components should support variants and className extension.

---

## B. Shared admin structure components

These come next.

- `AppSidebar`
- `AppHeader`
- `PageHeader`
- `Breadcrumb`
- `PageShell`
- `AuthShell`

These define the structure of the whole app.

---

## C. Shared form building blocks

To reduce repeated field markup:

- `FormField`
- `FieldLabel`
- `FieldHint`
- `FieldError`
- `SectionFormCard`
- `ChipInput`
- `FileUpload`

These are especially useful for upload/edit/settings pages.

---

## D. Shared display components

For dashboard and analytics reuse:

- `StatCard`
- `MetricCard`
- `StatusPill`
- `InfoNote`
- `EmptyState`
- `KeyValueRow`
- `LabelValue`

---

## Global theme system

All design tokens should live in `src/app/globals.css`.

### Fonts

Use only:

- **Outfit** for headings, labels, main UI text
- **JetBrains Mono** for slugs, IDs, file names, prices, version numbers, technical values

### Color system

Use CSS variables so every component can reuse the same tokens.

---

## Recommended `globals.css` theme tokens

```css
:root {
  /* Fonts */
  --font-sans: "Outfit", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Core surfaces */
  --background-app: #f7f7fb;
  --background-page: #fcfcff;
  --surface-card: #ffffff;
  --surface-muted: #f3f2ff;
  --surface-soft: #efefff;

  /* Brand */
  --color-primary: #6d4cff;
  --color-primary-hover: #5838e8;
  --color-primary-pressed: #472ec7;
  --color-primary-light: #eee9ff;
  --color-primary-text-light: #4b32c3;

  /* Sidebar */
  --sidebar-bg: #0b1020;
  --sidebar-hover: #12182b;
  --sidebar-active-bg: rgba(109, 76, 255, 0.18);
  --sidebar-active-border: #6d4cff;
  --sidebar-active-text: #ffffff;
  --sidebar-text: #8e95b5;
  --sidebar-section-label: #66708f;

  /* Borders */
  --border-default: #e6e8f2;
  --border-strong: #d9ddf0;

  /* Text */
  --text-primary: #0e1324;
  --text-secondary: #5f6785;
  --text-tertiary: #8b91a8;
  --text-faint: #a8aec2;

  /* Semantic */
  --color-success: #16a34a;
  --color-success-light: #dcfce7;
  --color-warning: #d97706;
  --color-warning-light: #fef3c7;
  --color-danger: #dc2626;
  --color-danger-light: #fee2e2;
  --color-info: #2563eb;
  --color-info-light: #dbeafe;

  /* Radius */
  --radius-card: 10px;
  --radius-input: 8px;
  --radius-button: 8px;
  --radius-pill: 999px;

  /* Shadow */
  --shadow-soft: 0 1px 2px rgba(16, 24, 40, 0.04);
}
```

---

## Tailwind + globals rule

### Use globals for:

- colors
- font families
- base text colors
- base backgrounds
- border defaults
- radius defaults

### Use Tailwind classes for:

- spacing
- flex/grid
- width/height
- responsive behavior
- state styling composition
- component variants

---

## Base classes to define globally

We should create some reusable CSS classes in `globals.css` too.

Examples:

```css
body {
  font-family: var(--font-sans);
  background: var(--background-app);
  color: var(--text-primary);
}

.font-mono-ui {
  font-family: var(--font-mono);
}

.sh-card {
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-card);
}

.sh-input {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-input);
  background: var(--surface-card);
  color: var(--text-primary);
}

.sh-muted-surface {
  background: var(--surface-muted);
}

.sh-soft-surface {
  background: var(--surface-soft);
}

.sh-page-title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
}

.sh-section-title {
  font-size: 18px;
  line-height: 28px;
  font-weight: 600;
}

.sh-card-title {
  font-size: 15px;
  line-height: 24px;
  font-weight: 600;
}
```

---

## What components must be globally reusable first

Before page migration starts, we should create these first:

1. `Button`
2. `Input`
3. `Textarea`
4. `Select`
5. `Badge`
6. `Card`
7. `Switch`
8. `Checkbox`
9. `PageHeader`
10. `AppHeader`
11. `AppSidebar`
12. `FormField`

These will cover most of the generated HTML conversion work.

---

## Naming rules

### Files

Use kebab-case:

- `page-header.tsx`
- `api-credentials-card.tsx`
- `sections-table.tsx`

### Components

Use PascalCase:

- `PageHeader`
- `ApiCredentialsCard`
- `SectionsTable`

### Constants

Use UPPER_SNAKE_CASE:

- `SIDEBAR_NAV_ITEMS`
- `SECTION_STATUS_OPTIONS`

### Types

Use PascalCase:

- `Section`
- `Category`
- `SettingsFormValues`

---

## Page building workflow

When you give code page by page, we will follow this workflow:

### Step 1

Read the generated HTML/Tailwind carefully.

### Step 2

Extract:

- page structure
- repeated patterns
- colors
- text styles
- reusable UI blocks

### Step 3

Move common patterns into:

- `components/ui`
- `components/shared`
- route `_components`

### Step 4

Replace hardcoded values with:

- global tokens
- shared classes
- props-based components

### Step 5

Update this guide after each major page/module is added.

---

## Guide update rule

Every time a new page or major component is added, update this guide in 4 areas:

### 1. Add page path

Example:

- `src/app/(dashboard)/settings/page.tsx`

### 2. Add page-specific components

Example:

- `settings-general-form.tsx`
- `settings-api-credentials-card.tsx`

### 3. Add any new reusable shared component

Example:

- `copy-field.tsx`
- `settings-toggle-row.tsx`

### 4. Add any new global token or utility only if truly shared

Never bloat globals for one-off styles.

---

## Structure rules for readability

### Good

- small files
- focused components
- page made from sections
- shared tokens
- minimal duplication

### Avoid

- giant page.tsx files
- repeated card markup everywhere
- hardcoded colors in every file
- mixing page-specific and shared components randomly
- very deep nesting without reason

---

## Example split for the Settings page

### Shared reusable parts

- `Button`
- `Input`
- `Switch`
- `Card`
- `PageHeader`
- `FormField`
- `InfoNote`
- `Badge`

### Settings page-specific parts

- `settings-nav.tsx`
- `general-settings-card.tsx`
- `api-credentials-card.tsx`
- `database-maintenance-card.tsx`

This is the balance we want.

---

## Example split for the Dashboard page

### Shared reusable parts

- `StatCard`
- `Card`
- `Badge`
- `PageHeader`

### Dashboard page-specific parts

- `installs-this-week-chart.tsx`
- `top-sections-list.tsx`
- `recent-activity-feed.tsx`
- `system-health-card.tsx`
- `top-categories-list.tsx`

---

## Example split for the Upload/Edit Section pages

### Shared reusable parts

- `Input`
- `Textarea`
- `Select`
- `Switch`
- `ChipInput`
- `FileUpload`
- `FormField`
- `SectionFormCard`
- `Badge`

### Page-specific parts

- `basic-information-card.tsx`
- `pricing-access-card.tsx`
- `liquid-file-card.tsx`
- `previews-card.tsx`
- `version-history-card.tsx`
- `publish-card.tsx`

---

## Notes about generated HTML conversion

Since you will provide already-generated HTML and Tailwind code page by page:

- we will **not** keep everything as one large HTML block
- we will convert it into **React components**
- we will extract repeated UI into reusable components
- we will map all recurring colors and fonts to the global theme
- we will keep the final result consistent with SectionHub design direction

---

## Initial implementation order

Start with this order:

1. `globals.css` theme setup
2. app shell layout
3. shared header + sidebar
4. base UI components
5. auth shell
6. settings page conversion
7. dashboard page conversion
8. sections pages
9. categories / bundles / analytics
10. remaining admin pages

This matches the product’s modular architecture and keeps the build clean. fileciteturn0file0L17-L19

---

## Current status

### Defined now

- Next.js app structure
- shared folder rules
- reusable component strategy
- route-level component rules
- global color and font token strategy
- guide update process

### Next step

You send me the generated code **page by page**, and I will:

- organize that page into this structure
- extract reusable components
- map colors/fonts into global tokens
- keep readability and reuseability strong
- update this guide as the project grows
