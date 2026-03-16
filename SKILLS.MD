# SectionHub Build and Handoff Guide

## Purpose

This file is a handoff document for building or continuing SectionHub using external agents like Gemini.
It explains the current structure, product scope, major modules, current architecture choices, and how the app should be extended.

## Product summary

SectionHub is a private admin dashboard for managing premium Shopify Liquid sections.

It includes:

- auth
- section catalog management
- categories and tags
- bundles
- orders
- customers and shops
- analytics
- activity logs
- settings

## Frontend stack

- Next.js App Router
- React
- TypeScript
- Tailwind-based styling with custom utility classes and CSS variables

## Backend stack

- Next.js route handlers in `app/api/**`
- MongoDB
- Mongoose

## Database layer

- connection file: `lib/db.ts`
- models: `lib/models/**`

## Important architectural rule

The API layer should keep request-specific logic inside `app/api/**/route.ts`.

Allowed shared imports:

- `lib/db.ts`
- `lib/models/**`
- small shared format helpers if needed

Avoid this pattern for API routes:

- route -> lib/sectionhub/\*/service just to fetch or shape API data

Preferred pattern:

- route handler imports db/models directly
- route handler performs query, mapping, validation, and response shaping

## Current folder structure

### App

- `app/(auth)/*`
- `app/(dashboard)/*`
- `app/api/*`
- `app/actions.ts`

### Components

- `components/sectionhub/layout/*`
- `components/sectionhub/ui/*`
- `components/sectionhub/forms/*`
- `components/sectionhub/screens/auth/*`
- `components/sectionhub/screens/catalog/*`
- `components/sectionhub/screens/dashboard/*`
- `components/sectionhub/screens/ops/*`

### Library

- `lib/db.ts`
- `lib/auth/server.ts`
- `lib/models/**`
- `lib/data/**`
- `lib/sectionhub/shared/format.ts`

### Data

Static/demo data and navigation config:

- `lib/data/sectionhub/**`
- `lib/data/navigation/**`

### Models

- `lib/models/auth/**`
- `lib/models/catalog/**`
- `lib/models/commerce/**`
- `lib/models/analytics/**`
- `lib/models/system/**`

## Main modules

### Auth

Files:

- `app/(auth)/login/page.tsx`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `app/api/auth/login/route.ts`
- `app/api/auth/forgot-password/route.ts`
- `app/api/auth/reset-password/route.ts`
- `lib/auth/server.ts`

Current behavior:

- local email/password auth
- cookie session
- local password reset token flow
- no 2FA yet

Seeded local credentials:

- email: `admin@sectionhub.com`
- password: `admin12345`

### Dashboard

Files:

- `app/(dashboard)/dashboard/page.tsx`
- `app/api/analytics/overview/route.ts`

Shows:

- totals
- recent sections
- top sections
- activity
- categories
- weekly installs

### Sections

Files:

- `app/(dashboard)/sections/page.tsx`
- `app/(dashboard)/sections/new/page.tsx`
- `app/(dashboard)/sections/[id]/edit/page.tsx`
- `app/api/sections/route.ts`
- `app/api/sections/[id]/route.ts`
- `app/api/sections/[id]/publish/route.ts`

Capabilities:

- list
- filter
- create/update via actions
- publish validation
- previews and metadata

### Categories

Files:

- `app/(dashboard)/categories/page.tsx`
- `app/api/categories/route.ts`

### Tags

Files:

- `app/(dashboard)/tags/page.tsx`
- `app/api/tags/route.ts`

### Bundles

Files:

- `app/(dashboard)/bundles/page.tsx`
- `app/api/bundles/route.ts`

### Orders

Files:

- `app/(dashboard)/orders/page.tsx`
- `app/api/orders/route.ts`

### Customers

Files:

- `app/(dashboard)/customers/page.tsx`
- `app/api/customers/route.ts`

### Settings

Files:

- `app/(dashboard)/settings/page.tsx`
- `app/api/settings/route.ts`

### Activity

Files:

- `app/(dashboard)/activity/page.tsx`

### Analytics

Files:

- `app/(dashboard)/analytics/page.tsx`
- `app/api/analytics/overview/route.ts`

## Styling and UI direction

The UI should remain:

- premium
- structured
- minimal
- admin-focused
- responsive

Important style rules:

- sidebar on `md+`
- drawer navigation on small screens
- mobile views should prefer stacked list/card layouts over wide tables
- use the current SectionHub palette and spacing system

## Existing documentation

- `AUTH.md` for auth usage

## Current limitations

- uploads are still not fully production-grade
- no real email provider for reset flow
- no 2FA
- several static/demo screen files still exist for visual reference
- some page actions still use shared logic from `lib/sectionhub/*/service.ts`

## Recommended next build order

1. finish moving all API logic fully into `app/api/**`
2. keep page/server-action business logic separate from API-only response shaping
3. implement uploads properly
4. add destructive action flows with confirmation modals
5. add production auth upgrades
6. clean remaining garbled text in older demo files if present

## If handing this to Gemini

Tell Gemini:

- keep MongoDB and Mongoose
- keep Next.js App Router
- preserve current UI structure and palette
- keep `lib/models/**` and `lib/db.ts`
- keep API request logic in `app/api/**/route.ts`
- do not reintroduce Prisma
- maintain responsive mobile list/card views
- preserve current sidebar and drawer behavior
