---
title: "Content is a contract"
description: "Why this generator treats your writing as a typed, presentation-agnostic contract — and what that buys you."
date: 2026-01-12T09:00:00Z
tags: [philosophy, types]
draft: false
---

Most static site generators blur the line between what you wrote and how it's shown. A
theme reaches into your posts; a post hard-codes a CSS class; a redesign quietly breaks
three years of archives. Pagewright draws a hard line instead.

## The contract is a type

`core/content.ts` reads your Markdown and produces plain, typed objects:

```ts
export type PostMeta = {
  title: string
  description?: string
  pubDate: string   // ISO date
  tags: string[]
  draft: boolean
}

export type Post = {
  meta: PostMeta
  slug: string
  html: string        // rendered body
  readingTime: number // minutes
}
```

That's the entire interface between your writing and everything that renders it. The
presentation layer imports these as **types only** — it never parses Markdown, and the
engine never emits site HTML. The dependency arrow points one way:

```
content/  →  core/ (engine)  →  site/ (presentation)  →  public/
```

## What the contract buys you

- **A redesign can't corrupt your archive.** Themes consume `Post`; they can't reshape it.
- **The compiler is the linter.** `bun run typecheck` validates that every template still
  satisfies the contract. Rename a field and TypeScript shows you every render site that
  breaks, before you ship.
- **Content is portable.** Because posts know nothing about presentation, you can restyle,
  re-theme, or even re-platform without editing a single post.

## The invariant

Adding posts is encouraged; _reshaping_ them is a breaking change to every theme. So the
rule is simple: change `content/` to say new things, change `site/` to show them
differently, and leave `core/` — the contract — alone unless you mean to renegotiate it.

Next: presentation is the opposite of invariant. It's meant to be rewritten — ideally by
an agent. See [Customize with an agent](/posts/customize-with-an-agent/).
