---
name: customize
description: Customize the look and feel of this Pagewright site — theme, colors, fonts, layout, branding, nav, footer, post listing, SEO markup. Use when the user wants to restyle, re-theme, rebrand, change the layout, or otherwise change how the site *looks* (not its content). Triggers like "make it dark/sepia/minimal", "change the font", "redesign the home page", "add a page to the nav", "make the listing a table".
---

# Customizing a Pagewright site

Pagewright separates **what is written** (invariant, typed content) from **how it looks**
(freely editable presentation). This skill governs presentation changes. Your job is to
realize the user's desired look by editing the `site/` layer only, then verify the build.

## The one rule

**Edit `site/` only.** Never edit `content/` or `src/` to achieve a visual change.

- `content/` is the writing — the invariant. Don't restyle by touching posts/pages.
- `src/` is the engine and the typed contract (`Post`, `Page`, `PostMeta`) plus the stable
  output structure (post URLs `/posts/<slug>/`, `sitemap.xml`, `feed.xml`). Don't edit it to
  restyle. If a request truly cannot be done without changing the contract or URL structure,
  stop and tell the user — that's a renegotiation, not a customization.

## Where to make each kind of change

| If the user asks to…                                   | Edit only…                       |
| ------------------------------------------------------ | -------------------------------- |
| Change colors / fonts / spacing / dark mode            | `site/styles/index.css`          |
| Change layout, header, footer, page `<head>`/meta tags | `site/templates/layout.ts`       |
| Change the nav                                          | `site/templates/nav.ts` (+ `NAV` in `site/site.config.ts`) |
| Change how a single post renders (byline, tags, etc.)  | `site/templates/post.ts`         |
| Change the post listing (grouping, table, cards…)      | `site/templates/posts-list.ts`   |
| Rebrand: title, tagline, author, socials, analytics    | `site/site.config.ts`            |
| Change the canonical host / base URL                    | `BASE_URL` in `site/site.config.ts` (also update `robots.txt`) |
| Change the 404 / error page or other static files       | `site/assets/` (copied verbatim to the site root) |

Everything the engine renders is reachable from `site/index.ts` (the barrel it imports).

## Contract you can rely on

The templates receive typed values from `src/content.ts`. Treat these as read-only inputs:

```ts
type PostMeta = { title: string; description?: string; pubDate: string; tags: string[]; draft: boolean }
type Post     = { meta: PostMeta; slug: string; html: string; readingTime: number }
type Page     = { title: string; description?: string; slug: string; html: string }
```

The presentation layer imports these **as types only** — never parse Markdown or read files
in `site/`. `renderPage(meta, content)` wraps body HTML in the layout; the build calls it.

## Workflow

1. Read the relevant `site/` file(s) before editing. Match the existing code style.
2. Make the change in `site/` only.
3. Verify:
   ```bash
   bun run typecheck   # the contract still holds (catches broken template ↔ content)
   bun run build       # writes ./public with no errors
   ```
4. For a visual sanity check, run `bun src/dev.ts` and view http://localhost:3000.
5. For risky presentation changes, do a behavior diff: snapshot `public/` before, rebuild,
   `diff -r` (only `feed.xml`'s `lastBuildDate` is expected to differ).

## Notes

- The default theme builds on a small base stylesheet (linked in `layout.ts`) plus a palette
  and design tokens in `site/styles/index.css`, with a light/dark toggle. None of this is
  load-bearing for the engine — read what `layout.ts` actually links and what `index.css`
  defines, then adapt. You may swap the base stylesheet, rewrite the palette, or drop the
  external link and write your own CSS wholesale if the user wants a different look.
- Analytics is optional: set `ANALYTICS_DOMAIN`/`ANALYTICS_WEBSITE_ID` in the config, or
  leave them empty to omit the snippet.
- Keep changes self-contained to `site/`. If you find yourself wanting to add a field to a
  post to render something, that's a content-contract change — surface it instead of doing it.
