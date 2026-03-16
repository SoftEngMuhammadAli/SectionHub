import Link from "next/link";
import { bundles, categories, sectionRows, tags } from "@/lib/data/sectionhub";
import { Badge, Button, Card, Field, SectionTitle, } from "@/components/sectionhub/ui";
function SmallCardTitle({ title, action }) {
    return (<div className="mb-4 flex items-center justify-between">
      <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
      {action ? (<span className="text-[12px] font-medium text-[var(--primary)]">
          {action}
        </span>) : null}
    </div>);
}
function InputRow({ placeholder = "Type here..." }) {
    return <input className="sectionhub-input" placeholder={placeholder}/>;
}
export function SectionsListScreen() {
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle title="Sections" subtitle="Manage premium Shopify Liquid sections, versions, previews, pricing, and publishing states."/>
        <Link href="/sections/new">
          <Button>+ Upload Section</Button>
        </Link>
      </div>
      <Card className="p-4">
        <div className="grid gap-3 xl:grid-cols-[1.8fr_repeat(5,1fr)_auto]">
          <input className="sectionhub-input" placeholder="Search sections, slugs, or authors"/>
          <select className="sectionhub-select">
            <option>Category</option>
          </select>
          <select className="sectionhub-select">
            <option>Tag</option>
          </select>
          <select className="sectionhub-select">
            <option>Pricing</option>
          </select>
          <select className="sectionhub-select">
            <option>Status</option>
          </select>
          <select className="sectionhub-select">
            <option>Date added</option>
          </select>
          <Button variant="secondary">Reset</Button>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div className="text-[13px] text-[var(--text-secondary)]">
            6 sections Ã‚Â· 2 selected would show bulk actions
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">Bulk archive</Button>
            <Button variant="danger">Bulk delete</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] text-left text-[13px]">
            <thead className="bg-[var(--page-bg)] text-[12px] text-[var(--text-tertiary)]">
              <tr>
                <th className="px-5 py-3">
                  <input type="checkbox" defaultChecked/>
                </th>
                <th className="px-5 py-3">Section</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Tags</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Version</th>
                <th className="px-5 py-3">Installs</th>
                <th className="px-5 py-3">Updated</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sectionRows.map((section, index) => (<tr key={section.id} className={index < 2
                ? "border-t border-[var(--border)] bg-[var(--primary-light)]/35"
                : "border-t border-[var(--border)] hover:bg-[var(--page-bg)]"}>
                  <td className="px-5 py-4">
                    <input type="checkbox" defaultChecked={index < 2}/>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 rounded-[8px] bg-[var(--muted-surface)]"/>
                      <div>
                        <div className="font-medium">{section.name}</div>
                        <div className="font-mono text-[11px] text-[var(--text-tertiary)]">
                          {section.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{section.category}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {section.tags.map((tag) => (<Badge key={tag} label={tag} tone="violet"/>))}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono">{section.price}</td>
                  <td className="px-5 py-4 font-mono">{section.version}</td>
                  <td className="px-5 py-4 font-mono">{section.installs}</td>
                  <td className="px-5 py-4 text-[var(--text-secondary)]">
                    {section.updatedAt}
                  </td>
                  <td className="px-5 py-4">
                    <Badge label={section.status} tone={section.status === "Published"
                ? "success"
                : section.status === "Draft"
                    ? "warning"
                    : "danger"}/>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Link href={`/sections/${section.id}/edit`} className="text-[var(--primary)]">
                        Edit
                      </Link>
                      <span className="text-[var(--danger)]">Delete</span>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4 text-[12px] text-[var(--text-secondary)]">
          <span>Showing 1Ã¢â‚¬â€œ6 of 86</span>
          <div className="flex gap-2">
            <Button variant="secondary" className="min-h-9 px-3">
              Previous
            </Button>
            <Button variant="secondary" className="min-h-9 px-3">
              1
            </Button>
            <Button className="min-h-9 px-3">2</Button>
            <Button variant="secondary" className="min-h-9 px-3">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>);
}
function SectionFormScreen({ title, subtitle, editMode = false, }) {
    const section = sectionRows[0];
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <SectionTitle title={title} subtitle={subtitle}/>
        <div className="flex flex-wrap gap-2">
          {editMode ? (<Button variant="secondary">View in marketplace ?</Button>) : null}
          {editMode ? (<Button variant="secondary">Duplicate section</Button>) : null}
          <Button variant="secondary">Save draft</Button>
          <Button variant="secondary">Preview</Button>
          <Button>Publish</Button>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.6fr_0.84fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <SmallCardTitle title="Basic Information"/>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Section name">
                <InputRow placeholder={section.name}/>
              </Field>
              <Field label="Slug">
                <input className="sectionhub-input font-mono" defaultValue={section.slug}/>
              </Field>
              <Field label="Short description">
                <InputRow placeholder="High-converting hero with layered merchandising."/>
              </Field>
              <Field label="Version">
                <input className="sectionhub-input font-mono" defaultValue={section.version}/>
              </Field>
              <div className="md:col-span-2">
                <Field label="Full description">
                  <textarea className="sectionhub-textarea" defaultValue="Hero Banner Pro is optimized for premium storefront launches, campaign landing pages, and product callout moments with strict spacing, configurable media slots, and merchant-safe controls."/>
                </Field>
              </div>
              <Field label="Category">
                <select className="sectionhub-select">
                  <option>{section.category}</option>
                </select>
              </Field>
              <Field label="Subcategory">
                <select className="sectionhub-select">
                  <option>Campaign Hero</option>
                </select>
              </Field>
              <Field label="Author">
                <InputRow placeholder={section.author}/>
              </Field>
              <Field label="Section status">
                <select className="sectionhub-select">
                  <option>{section.status}</option>
                </select>
              </Field>
            </div>
          </Card>
          <Card className="p-5">
            <SmallCardTitle title="Pricing & Access"/>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Pricing type">
                <select className="sectionhub-select">
                  <option>Paid</option>
                </select>
              </Field>
              <Field label="Access type">
                <select className="sectionhub-select">
                  <option>Single</option>
                </select>
              </Field>
              <Field label="Price">
                <input className="sectionhub-input font-mono" defaultValue="$39.00"/>
              </Field>
              <Field label="Compare at">
                <input className="sectionhub-input font-mono" defaultValue="$59.00"/>
              </Field>
              <Field label="License type">
                <select className="sectionhub-select">
                  <option>Single store</option>
                </select>
              </Field>
              <Field label="Featured flag">
                <select className="sectionhub-select">
                  <option>Featured</option>
                </select>
              </Field>
            </div>
          </Card>
          <Card className="p-5">
            <SmallCardTitle title="Tags" action="Suggested: conversion, os2.0, featured"/>
            <div className="flex flex-wrap gap-2">
              {["conversion", "os2.0", "featured", "hero", "mobile-first"].map((tag) => (<Badge key={tag} label={tag} tone="violet"/>))}
            </div>
          </Card>
          <Card className="p-5">
            <SmallCardTitle title="Liquid File"/>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Main .liquid upload" helper="Upload first, then attach metadata.">
                <div className="rounded-[10px] border border-dashed border-[var(--border-strong)] bg-[var(--page-bg)] p-4">
                  <div className="font-mono text-[13px]">
                    hero-banner-pro.liquid
                  </div>
                  <div className="mt-2 text-[12px] text-[var(--text-secondary)]">
                    1.2 MB Ã‚Â· checksum `sha256:a8f2...91d4`
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[var(--border)]">
                    <div className="h-2 w-full rounded-full bg-[var(--success)]"/>
                  </div>
                </div>
              </Field>
              <Field label="Optional assets zip">
                <div className="rounded-[10px] border border-dashed border-[var(--border-strong)] bg-[var(--page-bg)] p-4">
                  <div className="font-mono text-[13px]">
                    hero-banner-assets.zip
                  </div>
                  <div className="mt-2 text-[12px] text-[var(--text-secondary)]">
                    3.8 MB Ã‚Â· replace warning supported
                  </div>
                </div>
              </Field>
            </div>
          </Card>
          <Card className="p-5">
            <SmallCardTitle title="Documentation"/>
            <div className="grid gap-4">
              <Field label="Installation steps">
                <textarea className="sectionhub-textarea" defaultValue="1. Upload the section file into your Shopify theme.&#10;2. Add the section to the homepage template.&#10;3. Configure media, CTA, and overlay settings."/>
              </Field>
              <Field label="Merchant instructions">
                <textarea className="sectionhub-textarea" defaultValue="Use the headline field for a concise campaign promise. Recommended CTA length is under 24 characters."/>
              </Field>
              <Field label="Changelog">
                <textarea className="sectionhub-textarea" defaultValue="v2.4.1 Ã¢â‚¬â€ improved media cropping, fixed button spacing, added app block fallback."/>
              </Field>
            </div>
          </Card>
          <Card className="p-5">
            <SmallCardTitle title="Previews" action="Images Ã‚Â· Video Ã‚Â· YouTube Ã‚Â· Live URL"/>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (<div key={item} className="rounded-[10px] border border-[var(--border)] p-3">
                  <div className="h-28 rounded-[8px] bg-[var(--muted-surface)]"/>
                  <div className="mt-3 text-[13px] font-medium">
                    Hero layout preview {item}
                  </div>
                  <div className="mt-1 text-[12px] text-[var(--text-secondary)]">
                    Alt text, caption, and thumbnail selector supported.
                  </div>
                </div>))}
            </div>
          </Card>
          <Card className="p-5">
            <SmallCardTitle title="SEO / Marketplace Metadata"/>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Meta title">
                <InputRow placeholder="Hero Banner Pro Ã¢â‚¬â€ Shopify Premium Section"/>
              </Field>
              <Field label="Marketplace subtitle">
                <InputRow placeholder="High-converting launch hero for premium storefronts"/>
              </Field>
              <div className="md:col-span-2">
                <Field label="Meta description">
                  <textarea className="sectionhub-textarea" defaultValue="Launch-ready hero section with advanced media layout, precision spacing, and merchant-safe settings for Shopify OS 2.0 themes."/>
                </Field>
              </div>
              <Field label="Internal keywords">
                <InputRow placeholder="hero, conversion, campaign, launch"/>
              </Field>
              <Field label="Callout badge text">
                <InputRow placeholder="Top seller"/>
              </Field>
            </div>
          </Card>
          <Card className="p-5">
            <SmallCardTitle title="Compatibility & Requirements"/>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Theme compatibility">
                <InputRow placeholder="Dawn, Prestige, Impact"/>
              </Field>
              <Field label="Dependencies">
                <InputRow placeholder="No app dependency"/>
              </Field>
              <Field label="OS 2.0 compatible">
                <select className="sectionhub-select">
                  <option>Yes</option>
                </select>
              </Field>
              <Field label="App block support">
                <select className="sectionhub-select">
                  <option>Supported</option>
                </select>
              </Field>
              <Field label="Tested browsers">
                <InputRow placeholder="Chrome, Safari, Edge"/>
              </Field>
              <Field label="Environment">
                <InputRow placeholder="Desktop, tablet, mobile"/>
              </Field>
            </div>
          </Card>
          <Card className="border-[var(--danger)]/15 bg-[var(--danger-light)] p-5">
            <SmallCardTitle title="Danger Zone"/>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary">Archive</Button>
              <Button variant="danger">Delete</Button>
              {editMode ? <Button variant="danger">Unpublish</Button> : null}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-5">
            <SmallCardTitle title="Publish Card"/>
            <div className="space-y-3 text-[13px] text-[var(--text-secondary)]">
              <div className="flex items-center justify-between">
                <span>Active</span>
                <Badge label="On" tone="success"/>
              </div>
              <div className="flex items-center justify-between">
                <span>Featured</span>
                <Badge label="Yes" tone="violet"/>
              </div>
              <div className="flex items-center justify-between">
                <span>Free</span>
                <Badge label="No" tone="default"/>
              </div>
              <div className="flex items-center justify-between">
                <span>Visibility</span>
                <Badge label="Marketplace" tone="info"/>
              </div>
              <div className="flex items-center justify-between">
                <span>Publish date</span>
                <span className="font-mono">Mar 16, 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last modified</span>
                <span className="font-mono">08:42 UTC</span>
              </div>
            </div>
            <Button className="mt-4 w-full">Save changes</Button>
          </Card>
          <Card className="p-5">
            <SmallCardTitle title="Stats Card"/>
            <div className="space-y-3 text-[13px] text-[var(--text-secondary)]">
              <div className="flex items-center justify-between">
                <span>Total installs</span>
                <span className="font-mono">1,248</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active shops</span>
                <span className="font-mono">184</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Revenue</span>
                <span className="font-mono">$6,842</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Refund count</span>
                <span className="font-mono">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bundle inclusion</span>
                <span className="font-mono">3</span>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <SmallCardTitle title="Checklist Card"/>
            <div className="space-y-3 text-[13px] text-[var(--text-secondary)]">
              {[
            "Name added",
            "Slug generated",
            "Liquid file uploaded",
            "At least 1 preview",
            "Category selected",
            "Pricing set",
            "SEO metadata added",
        ].map((item) => (<div key={item} className="flex items-center gap-2">
                  <span className="text-[var(--success)]">?</span>
                  <span>{item}</span>
                </div>))}
            </div>
          </Card>
          <Card className="p-5">
            <SmallCardTitle title="Version History Card"/>
            <div className="space-y-4 text-[13px] text-[var(--text-secondary)]">
              <div className="rounded-[10px] bg-[var(--page-bg)] p-3">
                <div className="font-mono font-medium text-[var(--text-primary)]">
                  Current Ã‚Â· v2.4.1
                </div>
                <div className="mt-1">Release date: Mar 16, 2026</div>
              </div>
              <div className="rounded-[10px] bg-[var(--page-bg)] p-3">
                <div className="font-mono font-medium text-[var(--text-primary)]">
                  Previous Ã‚Â· v2.4.0
                </div>
                <div className="mt-1">Improved overlay spacing</div>
                <button className="mt-2 text-[12px] font-medium text-[var(--primary)]">
                  Rollback
                </button>
              </div>
            </div>
          </Card>
          {editMode ? (<Card className="p-5">
              <SmallCardTitle title="Audit Meta"/>
              <div className="space-y-3 text-[13px] text-[var(--text-secondary)]">
                <div className="flex items-center justify-between">
                  <span>Created by</span>
                  <span>Alex Rivera</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Created at</span>
                  <span className="font-mono">Feb 20, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last edited by</span>
                  <span>Nadia Khan</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last edited at</span>
                  <span className="font-mono">Mar 16, 2026</span>
                </div>
              </div>
            </Card>) : null}
        </div>
      </div>
    </div>);
}
export function NewSectionScreen() {
    return (<SectionFormScreen title="Upload New Section" subtitle="Sections / Upload New Ã‚Â· Create a new premium catalog item with complete documentation, pricing, previews, and publish controls."/>);
}
export function EditSectionScreen() {
    return (<SectionFormScreen title="Edit Section" subtitle="Sections / Hero Banner Pro Ã‚Â· Published Ã‚Â· Update metadata, versioning, pricing, and visibility without losing audit context." editMode/>);
}
export function CategoriesScreen() {
    return (<div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <SectionTitle title="Categories" subtitle="Group sections into strong browsing paths and keep the marketplace filter system clean."/>
        <Button>+ New Category</Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_380px]">
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {categories.map((category) => (<Card key={category.slug} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--primary-light)] font-semibold text-[var(--primary-light-text)]">
                  {category.icon}
                </div>
                <Badge label={category.status} tone={category.status === "Inactive"
                ? "default"
                : category.status === "Featured"
                    ? "violet"
                    : "success"}/>
              </div>
              <div className="mt-4">
                <div className="text-[15px] font-semibold">{category.name}</div>
                <div className="mt-1 font-mono text-[11px] text-[var(--text-tertiary)]">
                  {category.slug}
                </div>
              </div>
              <div className="mt-4 space-y-2 text-[13px] text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Sections</span>
                  <span className="font-mono">{category.count}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total installs</span>
                  <span className="font-mono">{category.installs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last updated</span>
                  <span className="font-mono">{category.updatedAt}</span>
                </div>
              </div>
            </Card>))}
        </div>
        <Card className="p-5">
          <SmallCardTitle title="Edit Category"/>
          <div className="space-y-4">
            <Field label="Name">
              <InputRow placeholder="Conversion Tools"/>
            </Field>
            <Field label="Slug">
              <input className="sectionhub-input font-mono" defaultValue="conversion-tools"/>
            </Field>
            <Field label="Description">
              <textarea className="sectionhub-textarea" defaultValue="High-performing sections focused on lift, intent capture, and merchandising conversion."/>
            </Field>
            <Field label="Icon picker">
              <select className="sectionhub-select">
                <option>Zap</option>
              </select>
            </Field>
            <Field label="Parent category">
              <select className="sectionhub-select">
                <option>None</option>
              </select>
            </Field>
            <Field label="Sort order">
              <input className="sectionhub-input font-mono" defaultValue="04"/>
            </Field>
            <Field label="Visibility">
              <select className="sectionhub-select">
                <option>Visible</option>
              </select>
            </Field>
            <Field label="Featured toggle">
              <select className="sectionhub-select">
                <option>Enabled</option>
              </select>
            </Field>
            <div className="flex gap-2">
              <Button className="flex-1">Save</Button>
              <Button variant="secondary" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>);
}
export function BundlesScreen() {
    return (<div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <SectionTitle title="Bundles" subtitle="Curate premium bundle offers, control access rules, and expose savings clearly across the catalog."/>
        <Button>+ New Bundle</Button>
      </div>
      <div className="space-y-4">
        {bundles.map((bundle) => (<Card key={bundle.id} className="p-5">
            <div className="grid gap-4 xl:grid-cols-[24px_1.2fr_1.2fr_0.9fr_0.9fr_0.7fr_0.7fr] xl:items-center">
              <div className="text-[var(--text-tertiary)]">??</div>
              <div>
                <div className="text-[15px] font-semibold">{bundle.name}</div>
                <div className="mt-1 text-[13px] text-[var(--text-secondary)]">
                  {bundle.slug} Ã‚Â· {bundle.niche}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[var(--text-tertiary)]">
                  Included sections
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {bundle.sections.map((section) => (<Badge key={section} label={section} tone="violet"/>))}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[var(--text-tertiary)]">
                  Pricing
                </div>
                <div className="mt-2 font-mono text-[13px]">
                  {bundle.price}{" "}
                  <span className="text-[var(--text-tertiary)] line-through">
                    {bundle.compareAtPrice}
                  </span>
                </div>
                <div className="mt-1">
                  <Badge label={`Save ${bundle.savings}`} tone="success"/>
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[var(--text-tertiary)]">
                  Access
                </div>
                <div className="mt-2 text-[13px] text-[var(--text-secondary)]">
                  {bundle.accessType}
                </div>
                <div className="mt-1 text-[13px] text-[var(--text-secondary)]">
                  {bundle.visibility}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-[var(--text-tertiary)]">
                  Installs
                </div>
                <div className="mt-2 font-mono text-[13px]">
                  {bundle.installs}
                </div>
                <div className="mt-1 text-[12px] text-[var(--text-tertiary)]">
                  {bundle.updatedAt}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <Badge label={bundle.status} tone={bundle.status === "Active" ? "success" : "warning"}/>
                <div className="flex gap-2 text-[13px]">
                  <button className="text-[var(--primary)]">Edit</button>
                  <button className="text-[var(--danger)]">Delete</button>
                </div>
              </div>
            </div>
          </Card>))}
      </div>
    </div>);
}
export function TagsScreen() {
    return (<div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <SectionTitle title="Tags" subtitle="Flexible labels for filters, search, merchandising logic, and faster catalog segmentation."/>
        <Button>+ New Tag</Button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.3fr_360px]">
        <Card className="overflow-hidden">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <SmallCardTitle title="Tag registry"/>
          </div>
          <div className="space-y-0">
            {tags.map((tag) => (<div key={tag.slug} className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4 text-[13px] first:border-t-0">
                <div>
                  <div className="font-medium">{tag.name}</div>
                  <div className="font-mono text-[11px] text-[var(--text-tertiary)]">
                    {tag.slug}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge label={tag.color} tone={tag.color === "success"
                ? "success"
                : tag.color === "warning"
                    ? "warning"
                    : tag.color === "info"
                        ? "info"
                        : tag.color === "danger"
                            ? "danger"
                            : tag.color === "violet"
                                ? "violet"
                                : "default"}/>
                  <span className="font-mono text-[12px] text-[var(--text-secondary)]">
                    {tag.usage} uses
                  </span>
                </div>
              </div>))}
          </div>
        </Card>
        <Card className="p-5">
          <SmallCardTitle title="Create Tag"/>
          <div className="space-y-4">
            <Field label="Name">
              <InputRow placeholder="announcement"/>
            </Field>
            <Field label="Slug">
              <input className="sectionhub-input font-mono" defaultValue="announcement"/>
            </Field>
            <Field label="Color">
              <select className="sectionhub-select">
                <option>Danger</option>
              </select>
            </Field>
            <Button className="w-full">Save tag</Button>
          </div>
        </Card>
      </div>
    </div>);
}
