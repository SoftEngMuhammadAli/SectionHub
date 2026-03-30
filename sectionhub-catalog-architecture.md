# SectionHub Catalog Architecture

This document explains how `sections`, `bundles`, `categories`, and `tags` work in the current codebase, how they are linked together, and what the current performance characteristics are.

## 1. Core Domain Model

The catalog is centered around `Section`.

### Section

File: `lib/models/catalog/section.js`

A section is the main sellable/catalog item.

Important fields:

- `name`, `slug`
- `categoryId` -> points to one `Category`
- `tagIds[]` -> points to many `Tag` records
- `versions[]` -> version history, liquid file metadata, checksum, release data
- `previews[]` -> images/videos/live URLs for marketplace/admin UI
- `pricingType`, `priceCents`, `compareAtPriceCents`
- `status`, `visibility`, `featured`
- `documentation`, `compatibility`

### Bundle

File: `lib/models/catalog/bundle.js`

A bundle is a group of sections.

Important fields:

- `name`, `slug`
- `sectionIds[]` -> points to many `Section` records
- `priceCents`, `compareAtPriceCents`
- `status`, `visibility`, `accessType`

Bundles do not directly store category or tag links. They inherit that meaning indirectly through the sections they include.

### Category

File: `lib/models/catalog/category.js`

A category groups sections.

Important fields:

- `name`, `slug`
- `description`, `icon`
- `sortOrder`
- `visibility`, `featured`, `status`
- `parentId` exists in the schema for nesting, although current upsert flows do not fully use it yet

### Tag

File: `lib/models/catalog/tag.js`

Tags are lightweight labels used for filtering and grouping sections.

Important fields:

- `name`, `slug`
- `color`

## 2. Relationship Map

```text
Category (1) ------> (many) Section
Tag (many) <------> (many) Section
Bundle (many) -----> (many) Section
```

### Actual link fields

- `Section.categoryId` links a section to a category
- `Section.tagIds[]` links a section to tags
- `Bundle.sectionIds[]` links a bundle to sections

There is no direct:

- `Bundle -> Category`
- `Bundle -> Tag`
- `Category -> Bundle`

Those relationships are derived through sections.

## 3. How They Work Together

### Sections and Categories

A section belongs to one category through `categoryId`.

When categories are loaded in `lib/sectionhub/categories/service.js`:

- all categories are fetched
- all sections are fetched
- sections are grouped in memory by matching `section.categoryId` to `category._id`

That is how category section counts are calculated.

### Sections and Tags

A section can have many tags through `tagIds[]`.

When tags are loaded in `lib/sectionhub/tags/service.js`:

- all tags are fetched
- all sections are fetched
- usage is computed by checking whether each section contains each tag ID

That is how tag usage counts are calculated.

### Bundles and Sections

A bundle contains many sections through `sectionIds[]`.

When bundles are loaded in `lib/sectionhub/bundles/service.js`:

- all bundles are fetched
- all sections are fetched
- section names are resolved in memory by matching `bundle.sectionIds[]` against section `_id`

This is how the bundle screen shows included section names.

### Bundles, Categories, and Tags

Bundles are not directly tagged or categorized.

Instead:

- a bundle is made from sections
- each section already belongs to a category and may have tags
- so the bundle's business meaning comes from the sections inside it

Example:

- Bundle `Starter Pack`
- Includes sections:
  - `Hero Banner Pro`
  - `Sticky Header`
  - `Mega Footer`

If those sections belong to categories like `Marketing` and `Navigation`, the bundle indirectly spans those areas.

## 4. Read Flow Architecture

Most admin pages are server-rendered pages under `app/(dashboard)`.

Pattern:

```text
Page component
  -> calls service in lib/sectionhub/*
  -> service connects to MongoDB
  -> service reads model(s)
  -> service formats data for UI
  -> page renders cards/tables/forms
```

Examples:

- `app/(dashboard)/sections/page.jsx` -> `getSections()`
- `app/(dashboard)/bundles/page.jsx` -> `getBundles()`
- `app/(dashboard)/categories/page.jsx` -> `getCategories()`
- `app/(dashboard)/settings/page.jsx` -> settings service

### Section reads

File: `lib/sectionhub/sections/service.js`

`getSections()`:

- loads sections with `populate("categoryId").populate("tagIds")`
- loads successful installs
- builds an `installMap`
- formats each section row for UI

`getSectionFormData()`:

- loads one section
- populates category and tags
- computes install count
- computes how many bundles include the section

## 5. Write Flow Architecture

All major mutations happen through server actions in `app/actions.js`.

Pattern:

```text
Form submit
  -> server action
  -> service function
  -> Mongoose model update/create
  -> activity log entry
  -> revalidatePath(...)
  -> redirect(...)
```

Examples:

- save section -> `saveSectionAction()` -> `createOrUpdateSection()`
- save bundle -> `saveBundleAction()` -> `upsertBundle()`
- save category -> `saveCategoryAction()` -> `upsertCategory()`
- save tag -> `saveTagAction()` -> `upsertTag()`

### How multi-select relationships are submitted

The UI serializes many-to-many inputs as comma-separated hidden form values:

- `tagIds` for section-tag links
- `sectionIds` for bundle-section links

This is handled by `components/sectionhub/forms/multi-select-chips.jsx`.

## 6. Section Lifecycle

### Create / Update

Section create/update currently goes through:

- `app/actions.js`
- `lib/sectionhub/sections/service.js`

The service builds one document that includes:

- base section metadata
- pricing + visibility
- documentation + compatibility
- tag links
- previews
- version data

### Publish

File: `lib/sectionhub/sections/service.js`

`publishSection(id)` currently:

- loads the section
- validates critical fields such as name, slug, category, and paid pricing
- does not hard-block on missing preview
- updates status to `PUBLISHED`
- promotes visibility from `INTERNAL` to `MARKETPLACE` when needed

### Delete

When a section is deleted:

- it is removed from bundles via `$pull` on `BundleModel.sectionIds`
- related install events are removed
- related section daily metrics are removed
- the section record itself is deleted

This cleanup lives in `deleteSection()` inside `lib/sectionhub/sections/service.js`.

## 7. Current Linking Rules

### Direct links stored in MongoDB

- Category to Section: direct via `Section.categoryId`
- Tag to Section: direct via `Section.tagIds[]`
- Bundle to Section: direct via `Bundle.sectionIds[]`

### Derived links

- Category to installs: derived by scanning installs for the category's sections
- Tag usage: derived by scanning sections
- Bundle section names: derived by joining bundle IDs to sections in memory
- Section bundle count: derived by counting bundles where `sectionIds` contains the section

## 8. Performance Characteristics

The current architecture is simple and understandable, and it is good for small to medium admin datasets.

### What is already good

- Slugs are indexed and unique on `Section`, `Bundle`, `Category`, and `Tag`
- Read services commonly use `.lean()` which reduces Mongoose overhead
- Section reads use `populate()` for category/tag hydration
- Mutations revalidate server-rendered pages with `revalidatePath()`

### Current cost pattern

Several services perform application-side joins by loading multiple collections and combining them in memory.

Examples:

- `getBundles()` loads all bundles and all sections, then matches IDs in memory
- `getCategories()` loads all categories, all sections, and all successful installs, then computes counts in memory
- `getTags()` loads all tags and all sections, then computes usage in memory
- `getSections()` loads all matching sections and all successful installs, then builds install totals in memory

### What that means in practice

This performs well when:

- catalog size is moderate
- admin traffic is modest
- write volume is not extremely high

This will become slower as:

- section count grows large
- install event volume grows large
- bundle/category pages are opened frequently

### Likely bottlenecks at scale

- scanning all successful installs repeatedly
- scanning all sections repeatedly for tag/category/bundle calculations
- repeated in-memory joins instead of database-side aggregation

## 9. How It Would Scale Better Later

If the dataset grows, the next step is not a full rewrite. The current design can be improved incrementally.

Recommended future improvements:

1. Add aggregation pipelines for category, tag, and bundle summaries instead of full in-memory scans.
2. Store derived counters such as:
   - section install count
   - tag usage count
   - category section count
   - category install count
3. Keep the latest section version denormalized at top level for cheaper reads.
4. Replace repeated section lookups in bundles with a single indexed lookup or aggregation join.
5. Use paginated install analytics instead of loading all successful installs for every dashboard/read flow.
6. If parent categories are needed, finish wiring `parentId` through the category write flow and UI.

## 10. Practical Summary

If you want the shortest mental model:

- `Section` is the main catalog object.
- `Category` organizes sections.
- `Tag` labels sections.
- `Bundle` packages sections.
- Categories and tags connect to bundles only through the sections inside them.
- Reads are server-side and service-based.
- Writes go through server actions.
- Performance is fine for normal admin scale, but summary pages currently rely on in-memory joins and full scans more than ideal for large data volumes.

## 11. Main Files to Read

- `app/actions.js`
- `lib/models/catalog/section.js`
- `lib/models/catalog/bundle.js`
- `lib/models/catalog/category.js`
- `lib/models/catalog/tag.js`
- `lib/sectionhub/sections/service.js`
- `lib/sectionhub/bundles/service.js`
- `lib/sectionhub/categories/service.js`
- `lib/sectionhub/tags/service.js`
