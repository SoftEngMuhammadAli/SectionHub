# Analytics 1-Minute Sheet

## What to say first

SectionHub analytics is fully backend-driven.

The frontend sends a date range, the backend reads real MongoDB data, calculates the analytics, and sends the results back to the UI.

## Main flow

```text
Frontend -> Service -> Insights Layer -> MongoDB -> Calculated Results -> UI
```

## Easy answers

### How are installs calculated?

By counting successful install events in the selected date range.

### How is revenue calculated?

By summing paid orders in the selected date range.

### How are active shops calculated?

By counting shops that are not churned and are active in that period.

### How is conversion calculated?

By comparing shops that installed sections with shops that made paid orders.

### How are top sections calculated?

By grouping installs by section and sorting them from highest to lowest.

### How is category breakdown calculated?

By linking installs to sections, then sections to categories, and counting installs per category.

### Why do percentages change?

Because the system compares the current period with the previous period of the same length.

## One-line answer

Analytics in SectionHub works by reading real installs, orders, shops, sections, and categories from MongoDB, then converting them into totals, charts, and performance insights.

## 30-second script

When the user opens analytics, the frontend sends a selected range like 7, 30, or 90 days. The backend then reads real data such as install events, paid orders, shops, sections, and categories. After that, it calculates installs, revenue, active shops, conversion, top sections, and chart data, and the frontend displays those results.
