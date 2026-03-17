# SectionHub Admin Usage Guide

This guide explains how admins use each module in SectionHub and how to create/update records.

## 1. Login and Access

- Open `/login`.
- Sign in with admin credentials.
- Successful login redirects to `/dashboard`.
- If needed, use `/forgot-password` and `/reset-password`.

## 2. Dashboard (`/dashboard`)

Use this page for quick monitoring:

- Review total sections, installs, revenue, and active shops.
- Check recent activity and top categories.
- Use quick filters and jump to upload/edit flows.

## 3. Sections (`/sections`)

Main catalog management screen:

- Use search + filters (category, tag, status, pricing).
- Open a section for editing from actions.
- Use **Upload Section** to create a new one.

### Create Section (`/sections/new`)

- Fill core metadata (name, slug, category, descriptions).
- Set pricing and visibility.
- Add preview URL and tag IDs.
- Save to create draft.

### Edit Section (`/sections/[id]/edit`)

- Update metadata, pricing, preview, tags.
- Click **Save Changes** to persist.
- Click **Publish** when publish-readiness conditions are met.

## 4. Categories (`/categories`)

- View category cards/list with usage stats.
- Create/update a category from the form.
- Recommended fields: `name`, `slug`, `description`, `sortOrder`.

## 5. Tags (`/tags`)

- Create and manage tags used by sections.
- Keep slugs unique and predictable.
- Use tag color only as visual metadata.

## 6. Bundles (`/bundles`)

- Create grouped offers of multiple sections.
- Set bundle price and compare-at price.
- Provide `sectionIds` as comma-separated IDs.

## 7. Analytics (`/analytics`)

- Read overview KPIs and trend data.
- Use this for decisions, not direct edits.

## 8. Orders (`/orders`)

- Inspect purchase records and statuses.
- Filter by status/provider.
- Use for operational support and reconciliation.

## 9. Customers (`/customers`)

- Review customer/shop health snapshot.
- Useful for support and account-level tracking.

## 10. Activity Log (`/activity`)

- Audit admin/system actions.
- Use this before/after major changes.

## 11. Settings (`/settings`)

### General Settings

- Update site name, default currency, maintenance mode.
- Save from top-right **Save Changes**.

### API Credentials

- **Create New Key** creates a new active client credential.
- **Regenerate** rotates secret for the selected credential.
- Use reveal/copy controls for client secret handling.

### Database Maintenance

- **Run Optimizer** purges old logs/tokens/sessions.
- Use during low traffic or planned maintenance windows.

## 12. Global Search (Header)

- Search bar supports autosuggest.
- Global mode suggests pages and matching sections.
- Settings mode suggests in-page settings blocks.
- Press `Enter` to navigate to top suggestion.

## 13. Seeding and Local Setup

- Seed local data:
  - `npm run db:seed`
- Default local MongoDB URI comes from `.env`.
- After seeding, sign in with seeded admin credentials.

## 14. Operational Tips

- Always verify edits from list page after save.
- Publish only sections with complete metadata and preview.
- Rotate API secrets after sharing/incident exposure.
- Run maintenance periodically to keep DB clean.
