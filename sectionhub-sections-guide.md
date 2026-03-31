# Sections Guide

## Website purpose

SectionHub is a platform to manage reusable storefront sections.

It is used to:

- create sections
- organize them with categories and tags
- package them into bundles
- track installs, revenue, and activity

## What is a section?

A section is the **main product** of the system.

Examples:

- hero banner
- sticky header
- footer
- product grid

## Why sections matter

Sections are:

- the item admins create and edit
- the item shops install
- the item bundles contain
- the item analytics measures

So sections are the center of the whole website.

## Main section fields

File: `lib/models/catalog/section.js`

Important data:

- `name`, `slug`
- `categoryId`
- `tagIds[]`
- `status`, `visibility`, `featured`
- `pricingType`, `priceCents`
- `versions[]`
- `previews[]`

## Main relationships

- One category -> many sections
- Many tags -> many sections
- One bundle -> many sections
- One section -> many install events

## Architecture

```text
Sections UI
  -> saveSectionAction()
  -> sections service
  -> SectionModel
  -> MongoDB
```

## Main files

- `app/(dashboard)/sections/page.jsx`
- `app/(dashboard)/sections/new/page.jsx`
- `app/(dashboard)/sections/[id]/edit/page.jsx`
- `app/actions.js`
- `lib/sectionhub/sections/service.js`

## How it works

### Read flow

`getSections()`:

1. loads sections
2. populates category and tags
3. reads install events
4. calculates install counts
5. formats data for the UI

### Save flow

`saveSectionAction()`:

1. gets form data
2. validates name and slug
3. prepares pricing, tags, previews, and metadata
4. calls `createOrUpdateSection()`
5. writes activity log
6. revalidates pages
7. redirects back

## One-line presentation answer

> Sections are the core business object of SectionHub. The whole platform exists to create, manage, package, and measure these reusable storefront components.

## 20-second script

> In SectionHub, the Section is the main catalog item. It stores category, tags, pricing, version history, and publishing state. The admin UI sends section form data to a server action, which uses the service layer to save it in MongoDB. Bundles and analytics both depend on sections, so this is the core part of the system.
