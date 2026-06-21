---
title: "Hello, world"
description: "Your first post on a Pagewright site — and a tour of what's in the box."
date: 2026-01-10T09:00:00Z
tags: [meta, getting-started]
draft: false
---

Welcome to your new site. If you can read this, the build engine parsed this file's
frontmatter, rendered the Markdown below into HTML, and a template wrapped it in a layout —
all without you writing any HTML.

## Where things live

```
content/   what you write — posts, pages, images   (the contract)
src/       the build engine — parses content, writes public/
site/      how it looks — layout, styles, branding  (yours to change)
```

To publish a new post, drop a Markdown file in `content/posts/`. The filename becomes the
URL slug, so `content/posts/hello-world.md` is served at `/posts/hello-world/`.

## Frontmatter

Every post starts with a small block of typed metadata:

```yaml
---
title: "Hello, world"        # required
description: "One-liner"     # optional — used for SEO, the listing, and RSS
date: 2026-01-10T09:00:00Z   # required — drives sorting and the year grouping
tags: [meta, getting-started]
draft: false                 # drafts are hidden in production builds
---
```

That's the whole contract. Get it wrong and the build tells you — see
[Content is a contract](/posts/content-as-contract/).

## Code, with highlighting

Fenced code blocks are syntax-highlighted automatically; just name the language:

```ts
export type Post = {
  meta: PostMeta
  slug: string
  html: string
}
```

Now go change `content/pages/about.md`, then read the other two starter posts and delete
all three when you're ready to make this site your own.
