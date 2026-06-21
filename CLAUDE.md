# Guide for AI agents working on a "Let an agent build your blog" site

This repo is a small Bun + TypeScript static site generator, organized into three layers
with a deliberate boundary so the **look and feel can be changed safely without touching
content**.

```
content/   the writing — posts, pages, images. Add posts freely; keep the typed structure.
core/      the build engine — parses content into a typed model and renders the site. Don't edit.
site/      the presentation — layout, styles, branding, components. Change this freely.
```

There is a dedicated skill for presentation work at `.claude/skills/customize/SKILL.md`.
If the user asks to restyle/re-theme/rebrand/relayout, follow it.

## Where to make changes

| If you are asked to…                                    | Edit only…                         |
| ------------------------------------------------------- | ---------------------------------- |
| Restyle / change colors / fonts / spacing               | `site/styles/index.css`            |
| Change layout, header, footer, nav, page structure      | `site/components/*.ts`              |
| Rebrand: title, tagline, author, socials, nav, favicon  | `site/site.config.ts`              |
| Change how posts/listing/SEO markup render              | `site/components/*.ts`              |
| Add/edit a post or page                                 | `content/posts/` or `content/pages/` (see `content/README.md`) |

**To customize the website's appearance, you only need `site/`.** Everything the site
looks like is reachable from `site/index.ts` (the barrel the engine imports).

## Rules

- **Do not change the structure of `content/`** or the frontmatter contract documented in
  `content/README.md`. You may add posts; don't reshape them.
- **Do not edit `core/`** to achieve a presentation change. `core/content.ts` defines the
  `Post` / `Page` / `PostMeta` contract and `core/build.ts` owns the stable output structure
  (post URLs `/posts/<slug>/`, `sitemap.xml`, `feed.xml`). Components render that model.
- The presentation layer imports the content model as a **type only**; it never parses
  Markdown. The engine never emits site HTML. Keep that direction.

## Build & verify

```bash
bun run build      # generates the site into public/ (build output; gitignored, regenerated)
bun run typecheck  # validates the content/presentation contract (tsc --noEmit)
bun core/dev.ts     # build + watch + serve at http://localhost:3000 (includes drafts)
```

After a change, run `bun run build` and confirm it succeeds. For presentation changes,
the safest check is a behavior diff: snapshot `public/` before, rebuild, and `diff -r`
(only `feed.xml`'s `lastBuildDate` is expected to differ between builds).
