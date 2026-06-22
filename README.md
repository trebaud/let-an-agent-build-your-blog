# Let an agent build your blog

[![CI](https://github.com/trebaud/let-an-agent-build-your-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/trebaud/let-an-agent-build-your-blog/actions/workflows/ci.yml)
[![Bun](https://img.shields.io/badge/bun-1.x-000000?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)

A small static site generator (Bun + TypeScript) with one idea:

> **You don't need a templating engine.** Your content is typed data. Your theme is plain
> TypeScript functions. An agent designs the site

No Liquid, no Handlebars, no JSX runtime — a component is just a function that takes typed
content and returns an HTML string. That makes the whole presentation layer trivial for an
agent to rewrite.


## Quick start

One command scaffolds, installs, and builds a local blog — pick a theme, or `custom`
to have your coding agent design it:

```bash
bunx let-an-agent-build-your-blog my-blog
cd my-blog
bun dev   # build + watch + serve at http://localhost:3000 (drafts included)
```

It prompts for a starting theme (or pass `--theme <name>`; `--list` to see them all).
Choosing **custom** scaffolds the base theme and prints the exact command to run the
**customize** skill in Claude Code, Codex, Pi, or any agent:

```bash
bunx let-an-agent-build-your-blog my-blog --theme cosmic   # a premade theme
bunx let-an-agent-build-your-blog my-blog --theme custom   # design it with an agent
```

### Customize

1. Set `BASE_URL`, `AUTHOR`, title, nav, and socials in `site/site.config.ts`.
2. Add Markdown to `content/posts/` (frontmatter contract in `content/README.md`).
3. Restyle by asking an agent with the **customize** skill.

The repo ships an agent skill at
[`.claude/skills/customize/`](.claude/skills/customize/SKILL.md). Instead of hand-editing CSS
and components, describe the outcome and let the **customize** skill drive it:

> "Make it a warm sepia theme with a serif body font and a centered single-column layout. Use /customize."

> "Turn the post listing into a dense table and add a projects page to the nav."

The skill interviews you to pin down the design, edits `site/` **only**

### Build & deploy

```bash
bun run build      # generates the site into public/
```

Deploy the `public` build ouput to any static host (Netlify, Cloudflare Pages, GitHub
Pages, S3, Nginx…).

## Architecture

Three layers, one rule: **content and design never touch each other.**

```
content/   The writing — posts, pages, images. Typed, stable structure.
core/      The engine — parses content into a typed model, renders the site.
site/      The theme — everything the site looks like. Yours to rewrite.

content/  →  core/ (parse)  →  site/ (render)  →  public/
```

## Theme gallery

Eight themes, each built by the **customize** skill from the same content, each living on its
own branch. The first four are practical starting points; the next four push the framework
into more original, whimsical territory to show how far the presentation layer can travel.

**▶ Browse them all live: [trebaud.github.io/let-an-agent-build-your-blog](https://trebaud.github.io/let-an-agent-build-your-blog/)** — the same content built and deployed on every theme.

### Terminal / dev — the default

A monospace, Tokyo-Night palette with a `brand@host` header. Lives on `main` (also branched
as [`theme/terminal`](../../tree/theme/terminal)). **[▶ Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/terminal/)**

![Terminal theme: monospace dev blog listing, opening a post, then toggling to a dark Tokyo-Night palette](docs/themes/terminal.gif)

### Minimal / typographic — [`theme/minimal`](../../tree/theme/minimal)

One centered serif column on cream paper, generous whitespace, content first.
**[▶ Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/minimal/)**

![Minimal theme: centered serif column on cream paper, opening a post, then a warm dark mode](docs/themes/minimal.gif)

### Editorial / magazine — [`theme/editorial`](../../tree/theme/editorial)

A bold masthead and a responsive card grid with category kickers and an accent rule.
**[▶ Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/editorial/)**

![Editorial theme: magazine masthead and card grid, opening a post, then a dark mode with coral accent](docs/themes/editorial.gif)

### Personal landing — [`theme/personal`](../../tree/theme/personal)

A centered hero with avatar, tagline, and social links over a compact post list.
**[▶ Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/personal/)**

![Personal landing theme: centered hero with avatar and social pills, opening a post, then a mint dark mode](docs/themes/personal.gif)


### Retro 90s web — [`theme/retro`](../../tree/theme/retro)

A Web 1.0 fever dream: a tiled teal wallpaper, a Windows-95 window with a scrolling marquee
title bar, a blinking `NEW!` badge, a visitor counter, and a "best viewed in Netscape" footer.
**[▶ Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/retro/)**

![Retro 90s theme: teal-tiled Windows-95 window blog with a marquee title bar and visitor counter, opening a post, then toggling to a neon night-surfer dark mode](docs/themes/retro.gif)

### Hand-drawn notebook — [`theme/notebook`](../../tree/theme/notebook)

Marker-on-paper: a ruled cream page with a red margin line, handwriting fonts, SVG-wobbled
doodle borders, sticky-note accents, and a to-do-checklist post list. Dark mode is a chalkboard.
**[▶ Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/notebook/)**

![Hand-drawn notebook theme: ruled cream paper with handwriting and a checklist post list, opening a post, then toggling to a chalkboard dark mode](docs/themes/notebook.gif)

### Vaporwave / synthwave — [`theme/vaporwave`](../../tree/theme/vaporwave)

80s retro-future, dark by default: a glowing chrome title over a synthwave sun and a neon
perspective-grid horizon. Toggling reveals a pastel "daytime Miami" light mode.
**[▶ Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/vaporwave/)**

![Vaporwave theme: neon chrome title over a synthwave sun and grid horizon on deep purple, opening a post, then toggling to a pastel daytime Miami light mode](docs/themes/vaporwave.gif)

### Cosmic storybook — [`theme/cosmic`](../../tree/theme/cosmic)

A dreamy night sky: a twinkling star field, a glowing moon, an elegant serif with a gold
drop-cap, and ornamental dividers. Toggling fades the stars into a soft dawn.
**[▶ Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/cosmic/)**

![Cosmic storybook theme: serif blog over a twinkling night sky with a glowing moon and gold drop-cap, opening a post, then toggling to a soft dawn light mode](docs/themes/cosmic.gif)

Each theme is the diff of a single `git` branch against `main` — `site/styles/index.css`,
`site/site.config.ts`, and (for the editorial/personal layouts) a component or two. Nothing
in `content/` or `core/` changed.


## License

MIT — see [LICENSE](LICENSE).
