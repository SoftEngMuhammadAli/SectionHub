"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

function buildHref(pathname, currentParams, updates) {
  const params = new URLSearchParams(currentParams.toString());

  params.delete("q");
  params.delete("page");

  for (const [key, value] of Object.entries(updates)) {
    const nextValue = String(value ?? "").trim();

    if (nextValue) {
      params.set(key, nextValue);
    } else {
      params.delete(key);
    }
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function SectionsFilters({
  categories,
  tags,
  initialSearch = "",
  initialCategory = "",
  initialTag = "",
  initialPricing = "",
  initialStatus = "",
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  function navigate(updates) {
    const href = buildHref(pathname, searchParams, updates);
    startTransition(() => {
      router.push(href);
    });
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    navigate({ search });
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.75fr)_repeat(4,minmax(0,0.72fr))]">
      <form onSubmit={handleSearchSubmit} className="relative">
        <button
          type="submit"
          aria-label="Apply search"
          className="absolute left-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[8px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
          disabled={isPending}
        >
          <Search className="h-4 w-4" />
        </button>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search sections by name, slug or category..."
          className="sectionhub-input h-[42px] rounded-[10px] bg-white pl-10 pr-10 text-[13px]"
          disabled={isPending}
        />
        {search ? (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[8px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
            onClick={() => {
              setSearch("");
              navigate({ search: "" });
            }}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </form>

      <select
        value={initialCategory}
        onChange={(event) => navigate({ category: event.target.value })}
        className="sectionhub-select h-[42px] rounded-[10px] bg-white text-[13px]"
        disabled={isPending}
      >
        <option value="">All Categories</option>
        {categories.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        value={initialTag}
        onChange={(event) => navigate({ tag: event.target.value })}
        className="sectionhub-select h-[42px] rounded-[10px] bg-white text-[13px]"
        disabled={isPending}
      >
        <option value="">All Tags</option>
        {tags.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        value={initialPricing}
        onChange={(event) => navigate({ pricing: event.target.value })}
        className="sectionhub-select h-[42px] rounded-[10px] bg-white text-[13px]"
        disabled={isPending}
      >
        <option value="">Pricing: All</option>
        <option value="paid">Paid</option>
        <option value="free">Free</option>
      </select>

      <select
        value={initialStatus}
        onChange={(event) => navigate({ status: event.target.value })}
        className="sectionhub-select h-[42px] rounded-[10px] bg-white text-[13px]"
        disabled={isPending}
      >
        <option value="">Status: All</option>
        <option value="PUBLISHED">Status: Active</option>
        <option value="DRAFT">Status: Draft</option>
        <option value="ARCHIVED">Status: Archived</option>
      </select>
    </div>
  );
}
