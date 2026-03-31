# Bundles Guide

## Website purpose

SectionHub manages reusable storefront sections and lets admins package them into bundles and track their performance.

## What is a bundle?

A bundle is a **group of sections** sold or managed as one package.

Examples:

- Starter Pack
- Conversion Bundle
- Hero Suite

## Why bundles matter

Bundles help the business:

- sell multiple sections together
- create better offers
- support discounts and pricing strategy
- make the catalog more valuable

## Main bundle fields

File: `lib/models/catalog/bundle.js`

Important data:

- `name`, `slug`
- `priceCents`, `compareAtPriceCents`
- `status`, `visibility`
- `sectionIds[]`

## Most important relationship

```text
Bundle -> many Sections
```

Stored by:

- `Bundle.sectionIds[]`

Bundles do not directly store categories or tags.

They get that meaning through the sections inside them.

## Architecture

```text
Bundles UI
  -> saveBundleAction()
  -> bundles service
  -> BundleModel
  -> MongoDB
```

## Main files

- `app/(dashboard)/bundles/page.jsx`
- `app/actions.js`
- `lib/sectionhub/bundles/service.js`
- `lib/models/catalog/bundle.js`

## How it works

### Read flow

`getBundles()`:

1. loads bundles
2. loads sections
3. matches `sectionIds[]` to section names
4. calculates savings
5. returns UI-ready data

### Save flow

`saveBundleAction()`:

1. reads form data
2. validates name
3. generates slug if needed
4. checks that at least one section is selected
5. calls `upsertBundle()`
6. writes activity log
7. revalidates `/bundles`
8. redirects with success or error

## How bundles relate to the whole website

- sections = main product unit
- bundles = packaged group of those products

So bundles are the packaging layer of the system.

## One-line presentation answer

> Bundles are curated collections of sections. They reference section IDs instead of duplicating section content, which keeps the architecture simple and clean.

## 20-second script

> In SectionHub, bundles are higher-level products built from sections. Each bundle stores pricing, status, visibility, and a list of section IDs. The bundle form submits to a server action, which validates the data and saves it through the bundle service into MongoDB. So bundles are the packaging layer built on top of the main Section entity.
