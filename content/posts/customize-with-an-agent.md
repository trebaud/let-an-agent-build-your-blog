---
title: "Customize with an agent"
description: "The presentation layer is designed to be rewritten by an AI agent following a bundled skill — describe what you want, the agent edits only site/."
date: 2026-01-14T09:00:00Z
tags: [philosophy, agents, customization]
draft: false
---

If content is the invariant, the look and feel is the exact opposite: it's meant to be
thrown away and rebuilt as often as you like. Pagewright is laid out so that an AI agent
can do that safely.

## Everything visual is reachable from one place

`site/index.ts` is the only thing the engine imports for rendering. Behind it:

```
site/site.config.ts     branding: title, author, nav, socials, analytics
site/styles/index.css    the theme
site/templates/*.ts      layout, nav, post, listing
```

Want a different look? You only ever touch `site/`. The content and the engine stay put.

## The agent skill

This repo ships a skill at `.claude/skills/customize/SKILL.md`. It encodes the boundaries —
which files are fair game, which are off-limits, and how to verify a change. So instead of
hunting through the codebase, you describe the outcome:

> "Make it a warm sepia theme with a serif body font and a centered single-column layout."

> "Add a projects page to the nav and a footer with my email."

> "Make the post listing a dense table instead of grouped-by-year cards."

The agent edits `site/` only, runs `bun run build` and `bun run typecheck`, and the typed
contract guarantees it can't silently break your posts while restyling them.

## Why this works

Customization is risky precisely when presentation and content are tangled. Here they
aren't: the contract from [the previous post](/posts/content-as-contract/) means a styling
change provably can't reshape your writing. That safety is what makes "let an agent
redesign it" a reasonable thing to say out loud.

Open the skill file, point your agent at it, and tell it what you want.
