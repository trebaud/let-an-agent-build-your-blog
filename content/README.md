# content/ — the content layer

This directory is the **stable, presentation-agnostic** part of the site. The build
engine (`../core`) reads it into a typed model and the presentation layer (`../site`)
renders it. **Do not change the structure described here** — themes and the engine
depend on it.

## Layout

```
content/
├── posts/<slug>.md     # one post per file; the filename (minus .md) is the URL slug
├── pages/<name>.md     # standalone pages; home.md is special (renders the posts list)
└── assets/             # static files copied verbatim to /assets/...
    ├── img/            # images referenced from posts as /assets/img/<file>
    └── ...             # other downloadable assets, referenced as /assets/<file>
```

- A post at `posts/my-post.md` is published at `/posts/my-post/`.
- A page at `pages/about.md` is published at `/about/`. `pages/home.md` becomes `/`.
- Anything in `content/assets/` is served at `/assets/`, so reference it with an
  absolute path like `/assets/img/diagram.png`.

## Post frontmatter contract

```yaml
---
title: "Post title"             # required (string)
description: "One-line summary"  # optional, used for SEO / listing / RSS
date: 2026-01-15T09:00:00Z       # required; `pubDate` is also accepted as an alias
tags: [example, writing]         # optional list
draft: false                     # optional; drafts are hidden in production builds
---

Markdown body…
```

Notes:
- `date` (or `pubDate`) drives sorting, the year grouping on the home page, sitemap
  `lastmod`, and RSS `pubDate`. Use an ISO 8601 date.
- Drafts (`draft: true`) are excluded from the production build. They appear locally when
  the engine runs with `INCLUDE_DRAFTS=true` (which `bun core/dev.ts` sets automatically).
- Code blocks are syntax-highlighted (highlight.js); annotate fences with a language.

## Page frontmatter contract

```yaml
---
title: "About"   # required
description: "…"  # optional
---
```

The model these files map to (`Post`, `Page`, `PostMeta`) is defined in
`../core/content.ts` — that is the contract between content and presentation.
