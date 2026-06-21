# Guide for AI agents working on a Pagewright site

This repo is a small Bun + TypeScript static site generator, organized into three layers
with a deliberate boundary so the **look and feel can be changed safely without touching
content**.

```
content/   INVARIANT  — posts, pages, images. The writing. Stable, typed structure.
src/       INVARIANT  — build engine: parses content into a typed model, writes public/.
site/      EDITABLE   — all presentation: layout, styles, branding, templates.
```

There is a dedicated skill for presentation work at `.claude/skills/customize/SKILL.md`.
If the user asks to restyle/re-theme/rebrand/relayout, follow it.

## Where to make changes

| If you are asked to…                                    | Edit only…                         |
| ------------------------------------------------------- | ---------------------------------- |
| Restyle / change colors / fonts / spacing               | `site/styles/index.css`            |
| Change layout, header, footer, nav, page structure      | `site/templates/*.ts`              |
| Rebrand: title, tagline, author, socials, nav, favicon  | `site/site.config.ts`              |
| Change how posts/listing/SEO markup render              | `site/templates/*.ts`              |
| Add/edit a post or page                                 | `content/posts/` or `content/pages/` (see `content/README.md`) |

**To customize the website's appearance, you only need `site/`.** Everything the site
looks like is reachable from `site/index.ts` (the barrel the engine imports).

## Rules

- **Do not change the structure of `content/`** or the frontmatter contract documented in
  `content/README.md`. Posts are the invariant. You may add posts; don't reshape them.
- **Do not edit `src/`** to achieve a presentation change. `src/content.ts` defines the
  `Post` / `Page` / `PostMeta` contract and `src/build.ts` owns the stable output structure
  (post URLs `/posts/<slug>/`, `sitemap.xml`, `feed.xml`). Templates render that model.
- The presentation layer imports the content model as a **type only**; it never parses
  Markdown. The engine never emits site HTML. Keep that direction.

## Build & verify

```bash
bun run build      # writes ./public
bun run typecheck  # validates the content/presentation contract (tsc --noEmit)
bun src/dev.ts     # build + watch + serve at http://localhost:3000 (includes drafts)
```

After a change, run `bun run build` and confirm it succeeds. For presentation changes,
the safest check is a behavior diff: snapshot `public/` before, rebuild, and `diff -r`
(only `feed.xml`'s `lastBuildDate` is expected to differ between builds).
