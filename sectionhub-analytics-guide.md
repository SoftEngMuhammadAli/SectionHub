# Analytics Guide

## Website purpose

SectionHub helps admins manage storefront sections, bundles, categories, and tags.

Analytics is the part that shows what is happening in the system:

- how many installs happened
- how much revenue was generated
- which sections are performing best
- which shops are active
- what recent activity happened

## How analytics works now

Analytics is now **really backend-driven**.

It is not based on fake page data anymore. The UI reads calculated results from the backend, and the backend reads real MongoDB records.

## Simple architecture

```text
Analytics page / Dashboard page
  -> analytics service / dashboard service
  -> shared insights layer
  -> MongoDB models
  -> database records
```

## Main files

- `app/(dashboard)/analytics/page.jsx`
- `app/(dashboard)/dashboard/page.jsx`
- `lib/sectionhub/analytics/service.js`
- `lib/sectionhub/dashboard/service.js`
- `lib/sectionhub/analytics/insights.js`
- `app/api/analytics/overview/route.js`

## Main data sources

- `SectionModel`
- `CategoryModel`
- `InstallEventModel`
- `OrderModel`
- `ShopModel`
- `ActivityLogModel`

## What each data source does

### Sections

Used for section names, slugs, prices, and category links.

### Categories

Used to group sections and build category performance breakdowns.

### Install events

Used for install counts, recent installs, and weekly activity charts.

### Orders

Used for real revenue totals and revenue trend charts.

### Shops

Used to show active shops and map installs to real shop domains.

### Activity logs

Used for dashboard activity feeds and system event views.

## How the analytics page works

`app/(dashboard)/analytics/page.jsx` asks `getAnalyticsData()`.

`getAnalyticsData()` calls `buildAnalyticsInsights()` in `lib/sectionhub/analytics/insights.js`.

That function:

- loads real data from MongoDB
- supports `7D`, `30D`, and `90D`
- compares current range with previous range
- calculates metric deltas
- builds daily revenue series
- builds recent installs list
- finds top sections
- builds category breakdown

So the analytics page cards, lists, and charts now come from real aggregated backend data.

## How the dashboard works

`app/(dashboard)/dashboard/page.jsx` asks `getDashboardData()`.

That calls `buildDashboardInsights()` from the same shared insights file.

It returns:

- top summary cards
- installs this week chart
- top sections
- recent activity
- system health style summaries
- revenue trend data

This means both the dashboard and analytics page share one backend analytics architecture.

## How bundles are related

Bundles are related to analytics through sections.

- bundles are collections of sections
- sections are the main content being installed and purchased
- analytics mainly measures installs, orders, revenue, and performance of those sections

So bundles matter to the business side, but the current analytics logic is mostly calculated from section activity, install events, paid orders, shops, and logs.

## Important note for demo

If seed data is small, charts may look sharp or uneven.

That is normal now, because analytics is using real stored data instead of smooth fake placeholders.

## One-line presentation answer

> Analytics in SectionHub now works by reading real installs, orders, shops, sections, categories, and logs from MongoDB, then turning them into dashboard cards, charts, and performance insights.

## 20-second script

> SectionHub analytics is now fully backend-driven. The analytics page and dashboard both call service files, and those services use one shared insights layer. That insights layer reads real data from MongoDB, including sections, categories, install events, paid orders, shops, and activity logs. Then it calculates totals, deltas, charts, recent installs, and top-performing sections for the frontend.
