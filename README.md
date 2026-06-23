# Let an agent build your blog

[![CI](https://github.com/trebaud/let-an-agent-build-your-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/trebaud/let-an-agent-build-your-blog/actions/workflows/ci.yml)
[![Bun](https://img.shields.io/badge/bun-1.x-000000?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)

A small static site generator (Bun + TypeScript) built around one idea:

> **Your content is typed data. Your theme is plain TypeScript. An agent designs the look.**

No template DSL — a component is a function that takes typed content and returns an HTML string.
The whole look lives in a few small functions, so an agent can rewrite the presentation layer
without touching your writing or the build engine.

## Quick start

Requires [Bun](https://bun.sh) `1.x`.

```bash
bunx let-an-agent-build-your-blog my-blog
cd my-blog
bun dev   # build + watch + serve at http://localhost:3000 (drafts included)
```

Skip the theme prompt with a flag:

```bash
bunx let-an-agent-build-your-blog my-blog --theme cosmic   # premade theme
bunx let-an-agent-build-your-blog my-blog --theme custom   # design it with an agent
bunx let-an-agent-build-your-blog --list                   # list themes
```

**custom** scaffolds the base theme and prints the command to run the `customize` skill in
Claude Code, Codex, Pi, or any other agent.

## How it's organized

Three layers, one rule: **content and design never touch each other.**

```
content/  →  core/ (parse)  →  site/ (render)  →  public/
```

- **`content/`** — posts and pages (Markdown + frontmatter). Frontmatter contract: [`content/README.md`](content/README.md).
- **`core/`** — the build engine. Don't edit.
- **`site/`** — the active theme: `site.config.ts`, `components/`, `styles/index.css`. Yours to rewrite.

Each premade theme is its own branch, so on any branch `site/` holds exactly one theme — nothing
for an agent to confuse it with.

## Customizing with an agent

The repo ships a `customize` skill at
[`.claude/skills/customize/`](.claude/skills/customize/SKILL.md) (mirrored under `.agents/`).
Describe the look and let it drive — it edits `site/` only:

> "Make it a warm sepia theme with a serif body font and a centered single-column layout."

> "Turn the post listing into a dense table and add a Projects page to the nav."

## Build & deploy

```bash
bun run build      # → public/
```

Set `BASE_URL` in `site/site.config.ts` first — it's baked into canonical URLs, Open Graph tags,
the sitemap, and the RSS feed.

## Theme gallery

**▶ Browse them all live: [trebaud.github.io/let-an-agent-build-your-blog](https://trebaud.github.io/let-an-agent-build-your-blog/)**

### Terminal — default

Monospace Tokyo-Night with a `brand@host` header.
[Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/terminal/) · [`theme/terminal`](../../tree/theme/terminal)

![Terminal theme](docs/themes/terminal.gif)

### Minimal

One centered serif column on cream paper.
[Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/minimal/) · [`theme/minimal`](../../tree/theme/minimal)

![Minimal theme](docs/themes/minimal.gif)

### Editorial

Magazine masthead with a responsive card grid.
[Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/editorial/) · [`theme/editorial`](../../tree/theme/editorial)

![Editorial theme](docs/themes/editorial.gif)

### Personal

Centered hero with avatar and socials.
[Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/personal/) · [`theme/personal`](../../tree/theme/personal)

![Personal theme](docs/themes/personal.gif)

### Retro

90s Web 1.0 in a Windows-95 window.
[Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/retro/) · [`theme/retro`](../../tree/theme/retro)

![Retro theme](docs/themes/retro.gif)

### Notebook

Hand-drawn ruled-paper marker style.
[Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/notebook/) · [`theme/notebook`](../../tree/theme/notebook)

![Notebook theme](docs/themes/notebook.gif)

### Vaporwave

80s neon synthwave, dark by default.
[Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/vaporwave/) · [`theme/vaporwave`](../../tree/theme/vaporwave)

![Vaporwave theme](docs/themes/vaporwave.gif)

### Cosmic

Serif over a twinkling night sky.
[Live demo](https://trebaud.github.io/let-an-agent-build-your-blog/cosmic/) · [`theme/cosmic`](../../tree/theme/cosmic)

![Cosmic theme](docs/themes/cosmic.gif)

## License

MIT — see [LICENSE](LICENSE).
