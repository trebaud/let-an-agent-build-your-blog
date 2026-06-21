# Let an agent build your blog

A small static site generator (Bun + TypeScript) with one idea:

> **You don't need a templating engine.** Your content is typed data. Your theme is plain
> TypeScript functions. An agent restyles the site; the types guarantee it can't touch a word
> you wrote.

No Liquid, no Handlebars, no JSX runtime — a component is just a function that takes typed
content and returns an HTML string. That makes the whole presentation layer trivial for an
agent (or you) to rewrite, and impossible to rewrite *wrongly*: if a redesign breaks the
contract, `tsc` fails the build.

## Architecture

Three layers, one rule: **content and design never touch each other.**

```
content/   The writing — posts, pages, images. Typed, stable structure.
core/      The engine — parses content into a typed model, renders the site.
site/      The theme — everything the site looks like. Yours to rewrite.

content/  →  core/ (parse)  →  site/ (render)  →  public/
```

The arrow only points one way:

- `core/content.ts` parses Markdown into plain typed objects (`Post`, `Page`, `PostMeta`).
  That type **is** the contract between writing and design.
- `site/` imports that model **as a type only** — it never parses Markdown, and the engine
  never emits site HTML. Components are ordinary functions (`site/components/*.ts`):

  ```ts
  export const renderPostContent = (post: Post) => `<article>…</article>`
  ```

- Because the boundary is a TypeScript type, `bun run typecheck` is your safety net: rename a
  field and the compiler points at every component that breaks. **A redesign provably cannot
  reshape or corrupt your posts.**

## Content vs. design

| You want to…                              | Edit only…                |
| ----------------------------------------- | ------------------------- |
| Write or edit a post / page               | `content/`                |
| Restyle, re-theme, change colors/fonts    | `site/styles/index.css`   |
| Change layout, header, footer, nav        | `site/components/*.ts`     |
| Rebrand: title, tagline, author, socials  | `site/site.config.ts`     |

You can restyle the entire site without opening a single post, and write posts without
knowing anything about the theme. Add to `content/` freely, but don't reshape it (see
`content/README.md` for the frontmatter contract).

## Workflow: let an agent do the theming

The repo ships an agent skill at
[`.claude/skills/customize/`](.claude/skills/customize/SKILL.md). Instead of hand-editing CSS
and components, describe the outcome and let the **customize** skill drive it:

> "Make it a warm sepia theme with a serif body font and a centered single-column layout."

> "Turn the post listing into a dense table and add a projects page to the nav."

The skill interviews you to pin down the design, edits `site/` **only**, then runs
`bun run build` and `bun run typecheck` to prove the content contract still holds. That
guardrail is what makes "let an agent redesign it" safe to say.

## Quick start

```bash
bun install
bun core/dev.ts   # build + watch + serve at http://localhost:3000 (drafts included)
```

Then:

1. Set `BASE_URL`, `AUTHOR`, title, nav, and socials in `site/site.config.ts`.
2. Add Markdown to `content/posts/` (frontmatter contract in `content/README.md`).
3. Restyle by asking an agent (the **customize** skill) — or edit `site/` by hand.
4. Delete the starter posts and example `about` page when you're ready.

## Build & deploy

```bash
bun run build      # generates the site into public/
bun run typecheck  # tsc --noEmit — validates the content/design contract
```

`public/` is just the build output — regenerated from scratch on every build (gitignored,
safe to delete). Deploy its contents to any static host (Netlify, Cloudflare Pages, GitHub
Pages, S3, Nginx…). See [`AGENTS.md`](AGENTS.md) for the rules an agent follows when working
on the site.

## License

MIT — see [LICENSE](LICENSE).
