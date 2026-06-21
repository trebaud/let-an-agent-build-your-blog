# Pagewright

A small, hand-rolled static site generator (Bun + TypeScript) built around one idea:

> **Content is a contract, enforced by types. Presentation is open to any customization —
> ideally driven by an agent.**

The codebase is split into three layers so that **content and presentation are fully
independent**: you can restyle, re-theme, or rebrand the whole site without touching a
single post, and you can write posts without knowing anything about the templates.

## Philosophy

Most static site generators let presentation leak into content and vice-versa: a theme
reaches into your posts, a post hard-codes a CSS class, and a redesign quietly breaks years
of archives. Pagewright refuses that. It rests on two commitments.

### 1. Content is a contract, enforced through types

`src/content.ts` parses your Markdown into plain, typed objects — and that type *is* the
interface between what you write and everything that renders it:

```ts
type PostMeta = { title: string; description?: string; pubDate: string; tags: string[]; draft: boolean }
type Post     = { meta: PostMeta; slug: string; html: string; readingTime: number }
type Page     = { title: string; description?: string; slug: string; html: string }
```

The dependency arrow points one way and never back:

```
content/  →  site/ (presentation)  →  public/
```

Content never depends on presentation; the engine never emits site HTML; the presentation
layer imports the content model **as a type only** and never parses Markdown. Because the
boundary is a TypeScript type, `bun run typecheck` is your linter: rename a field and the
compiler shows you every template that breaks before you ship. A redesign *provably* cannot
reshape or corrupt your writing.

### 2. Presentation is open to any customization — via an agent skill

Everything the site looks like lives under `site/` and is reachable from a single barrel
(`site/index.ts`). That layer is meant to be rewritten freely. To make that safe and easy,
the repo ships an **agent skill** at [`.claude/skills/customize/`](.claude/skills/customize/SKILL.md)
that encodes the boundaries — which files are fair game, which are off-limits, and how to
verify a change. Instead of editing CSS by hand, you describe the outcome:

> "Make it a warm sepia theme with a serif body font and a centered single-column layout."

> "Turn the post listing into a dense table and add a projects page to the nav."

The agent edits `site/` only, then runs `bun run build` and `bun run typecheck`. The typed
contract guarantees it cannot silently break your posts while restyling them. That safety is
exactly what makes "let an agent redesign it" a reasonable thing to say.

## Architecture

```
content/   The writing — posts, pages, images. Invariant, stable structure.
           See content/README.md for the frontmatter contract.

src/       The build engine.
           - index.ts    entry point — runs the build
           - content.ts  parses content/ into a typed model (Post, Page, PostMeta)
                         — this model is the contract between content and presentation
           - build.ts    orchestrates load -> render -> write, and owns the stable
                         output structure (post URLs, sitemap.xml, feed.xml)
           - dev.ts      build + watch content + serve locally (drafts included)
           - server.ts   static file server for ./public

site/      The presentation layer — everything the site looks like.
           - site.config.ts   branding/identity: title, tagline, author, nav, socials,
                              analytics, favicon, stylesheet URL
           - styles/index.css the theme (layered on bamboo.css, light/dark)
           - templates/       layout, nav, post, posts-list
           - index.ts         barrel re-exporting the render functions

.claude/skills/customize/   the agent skill for safe presentation changes
```

## Quick start

```bash
bun install
bun src/dev.ts  # build + watch content + serve at http://localhost:3000 (drafts included)
```

Then:

1. Edit `site/site.config.ts` — set `BASE_URL`, `AUTHOR`, title, nav, socials.
2. Add Markdown to `content/posts/` (see `content/README.md` for the frontmatter contract).
3. Restyle by editing `site/` — or ask an agent (see the philosophy above).
4. Delete the three starter posts and the example `about` page when you're ready.

## Build & deploy

```bash
bun run build      # rm -rf public && bun src/index.ts  -> writes ./public
bun run typecheck  # tsc --noEmit — validates the content/presentation contract
```

`./public` is a plain folder of static files; host it anywhere (Netlify, Cloudflare Pages,
GitHub Pages, S3, Nginx…). `deploy.sh` is an example rsync-to-a-server script — adjust the
paths at the top before using it.

## Customizing

- **Restyle / relayout / rebrand:** edit `site/` only. Start at `site/styles/index.css` and
  `site/site.config.ts` — or point an agent at `.claude/skills/customize/SKILL.md`.
- **Write content:** add Markdown to `content/posts/` or `content/pages/`.

This layout is intentionally agent-friendly — see [`AGENTS.md`](AGENTS.md) for the rules an
agent should follow when modifying the site.

## License

MIT — see [LICENSE](LICENSE).
