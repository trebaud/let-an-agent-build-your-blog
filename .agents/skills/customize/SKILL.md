---
name: customize
description: Customize the look and feel of this "Let an agent build your blog" site — theme, colors, fonts, layout, branding, nav, footer, post listing, SEO markup. Use when the user wants to restyle, re-theme, rebrand, change the layout, or otherwise change how the site *looks* (not its content). Triggers like "make it dark/sepia/minimal", "change the font", "redesign the home page", "add a page to the nav", "make the listing a table".
---

# Customizing a "Let an agent build your blog" site

This generator separates **what is written** (typed content) from **how it looks**
(presentation you can freely change). This skill governs presentation changes. Your job is to
**first agree with the user on the design**, then realize it by editing the `site/` layer
only, then verify the build.

## Interview first, then build

Do not start editing on the first vague request. A prompt like "make it look modern",
"redesign the home page", or "give it a fresh theme" underspecifies the design. Run a short
interview until you and the user share a concrete picture of the target, then confirm it
before touching files.

1. **Look before you ask.** Read `site/styles/index.css`, `site/site.config.ts`, and the
   relevant `site/components/*.ts` so your questions are grounded in what exists today. Don't
   ask about things the code already answers.
2. **Interview.** Use the `AskUserQuestion` tool to resolve the design's open variables.
   Anchor it in the **Canonical blog design patterns** below: offer a couple of named
   archetypes as starting points (e.g. minimal/typographic vs. editorial/cards vs. the
   terminal/dev default), then pin down the dimensions that actually change the outcome —
   layout shape, listing shape, typography, color & theme, header & identity, post-page
   anatomy, density. Always settle **scope & boundaries** too: which pages are in scope and
   what must stay unchanged. Offer concrete options (named directions, and ASCII/option
   previews when comparing layouts) rather than open-ended prompts. Ask one focused round at
   a time and go deeper only where answers are still ambiguous. Skip questions the user
   already answered or that don't matter — a precise request ("change the body font to
   Georgia") needs no interview.
3. **Reach agreement.** Restate the agreed design back as a short spec: direction, palette,
   fonts, layout decisions, and what's out of scope. Get an explicit "yes" (or correction)
   before editing. This restated spec is the contract for the work — build to it, not to your
   own taste. If a request is large or could go several ways, consider proposing the spec via
   plan mode (`EnterPlanMode`) so the user approves before any edits.

Only once the design is agreed do you move to the workflow below.

## Canonical blog design patterns

Distilled from the recurring archetypes across the Hugo and Jekyll theme galleries. Use these
as shared vocabulary for the interview: name a starting archetype, then tune the dimensions.

### Archetypes (offer one as a starting point)

- **Minimal / typographic** — one centered column, content-first, generous whitespace, system
  or a single serif font, light/dark toggle. Listing is just title + date (maybe a one-line
  excerpt). *Like PaperMod, Minima, no-style-please.*
- **Personal landing** — centered hero with name/avatar/tagline and social links, then a short
  post list. Identity-forward. *Like Anatole, Hugo Coder.*
- **Editorial / magazine** — cards or a grid with cover images, categories, and clear visual
  hierarchy; scannable, good for image-rich or high-volume blogs. *Like Stack, Congo.*
- **Developer / terminal** — monospace, dark, prompt / `brand@host` aesthetic, code-forward.
  *Like Terminal, Geekblog.* **This is today's default** — see `index.css` + `layout.ts`.
- **Docs / knowledge base** — left sidebar nav plus an in-page table of contents, two columns,
  search. More reference than blog. *Like Chirpy, Minimal Mistakes.*

### Dimensions (pin these down, then map to files)

| Dimension         | Canonical options / conventions                                                                 | Lives in |
| ----------------- | ----------------------------------------------------------------------------------------------- | -------- |
| Layout shape      | single centered column (≈60–75ch / 650–760px) · sidebar · two-column · card grid · magazine     | `layout.ts`, `index.css` |
| Listing shape     | plain list (title+date) · list w/ excerpts · cards w/ covers · grid · grouped by year/tag · table | `posts-list.ts` |
| Typography        | serif / sans / mono body; optional heading pairing; system stack vs. web font; base 16–18px, line-height ~1.6, measure 45–75ch | `index.css` |
| Color & theme     | light / dark / both (toggle); background white / cream / deep navy; ONE accent for links/buttons; ≥4.5:1 contrast; 2–3 colors total | `index.css` |
| Header & identity | minimal top nav · centered hero w/ avatar+tagline · sidebar · terminal prompt; social-link placement | `layout.ts`, `nav.ts`, `site.config.ts` |
| Post-page anatomy | byline (date · reading time · tags) · table of contents y/n · cover image · back link · prev/next | `post.ts` |
| Density & chrome  | minimal / content-only ←→ decorated (cards, borders, shadows)                                   | `index.css` |
| Personality       | minimal · editorial · brutalist · terminal/dev · playful · corporate · retro · academic         | all of `site/` |

Sensible defaults to keep unless the user asks otherwise: a readable measure (45–75ch), one
accent color, ≥4.5:1 contrast, and no more than two font families.

## The one rule

**Edit `site/` only.** Never edit `content/` or `core/` to achieve a visual change.

- `content/` is the writing. Don't restyle by touching posts/pages.
- `core/` is the engine and the typed contract (`Post`, `Page`, `PostMeta`) plus the stable
  output structure (post URLs `/posts/<slug>/`, `sitemap.xml`, `feed.xml`). Don't edit it to
  restyle. If a request truly cannot be done without changing the contract or URL structure,
  stop and tell the user — that's a renegotiation, not a customization.

## Where to make each kind of change

| If the user asks to…                                   | Edit only…                       |
| ------------------------------------------------------ | -------------------------------- |
| Change colors / fonts / spacing / dark mode            | `site/styles/index.css`          |
| Change layout, header, footer, page `<head>`/meta tags | `site/components/layout.ts`       |
| Change the nav                                          | `site/components/nav.ts` (+ `NAV` in `site/site.config.ts`) |
| Change how a single post renders (byline, tags, etc.)  | `site/components/post.ts`         |
| Change the post listing (grouping, table, cards…)      | `site/components/posts-list.ts`   |
| Rebrand: title, tagline, author, socials, analytics    | `site/site.config.ts`            |
| Change the canonical host / base URL                    | `BASE_URL` in `site/site.config.ts` (also update `site/assets/robots.txt`) |
| Change the 404 / error page or other static files       | `site/assets/` (copied verbatim to the site root) |

Everything the engine renders is reachable from `site/index.ts` (the barrel it imports).

## Contract you can rely on

The components receive typed values from `core/content.ts`. Treat these as read-only inputs:

```ts
type PostMeta = { title: string; description?: string; pubDate: string; tags: string[]; draft: boolean }
type Post     = { meta: PostMeta; slug: string; html: string; readingTime: number }
type Page     = { title: string; description?: string; slug: string; html: string }
```

The presentation layer imports these **as types only** — never parse Markdown or read files
in `site/`. `renderPage(meta, content)` wraps body HTML in the layout; the build calls it.

## Workflow

Run this only after the design is agreed (see "Interview first, then build" above).

1. Read the relevant `site/` file(s) before editing. Match the existing code style.
2. Make the change in `site/` only, building to the agreed spec — not to your own taste.
3. Verify:
   ```bash
   bun run typecheck   # the contract still holds (catches broken component ↔ content)
   bun run build       # rebuilds the site with no errors
   ```
4. For a visual sanity check, run `bun core/dev.ts` and view http://localhost:3000.
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
