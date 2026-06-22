#!/usr/bin/env bun
// Initializer for "Let an agent build your blog".
//
//   bunx let-an-agent-build-your-blog my-blog
//
// Fetches the template (files only, no branches/history), installs deps, builds,
// and prints next steps. Pick a premade theme, or "custom" to have your coding
// agent design it via the /customize skill.

import { mkdir, rm, readdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createInterface } from "node:readline"

const REPO = "trebaud/let-an-agent-build-your-blog"

type Theme = { name: string; branch: string; blurb: string }

// `custom` and `terminal` both ship from main; the rest live on theme branches.
const THEMES: Theme[] = [
  { name: "custom", branch: "main", blurb: "design your own — prints agent commands to run /customize ✨" },
  { name: "terminal", branch: "main", blurb: "monospace Tokyo-Night dev blog (default)" },
  { name: "minimal", branch: "theme/minimal", blurb: "centered serif column on cream paper" },
  { name: "editorial", branch: "theme/editorial", blurb: "magazine masthead + card grid" },
  { name: "personal", branch: "theme/personal", blurb: "centered hero with avatar + socials" },
  { name: "retro", branch: "theme/retro", blurb: "90s Web 1.0 / Windows-95 window" },
  { name: "notebook", branch: "theme/notebook", blurb: "hand-drawn ruled-paper marker style" },
  { name: "vaporwave", branch: "theme/vaporwave", blurb: "80s neon synthwave, dark by default" },
  { name: "cosmic", branch: "theme/cosmic", blurb: "serif over a twinkling night sky" },
]

const DEFAULT_THEME = THEMES.find((t) => t.name === "terminal")!

// ── tiny ANSI helpers (no-op when not a TTY) ────────────────────────────────
const tty = process.stdout.isTTY
const paint = (code: string) => (s: string) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s)
const bold = paint("1")
const dim = paint("2")
const green = paint("32")
const cyan = paint("36")

function printUsage() {
  console.log(`
${bold("Let an agent build your blog")} — create a new blog.

${bold("Usage")}
  bunx ${REPO.split("/")[1]} <dir> [--theme <name>]
  bunx ${REPO.split("/")[1]} --list

${bold("Options")}
  --theme <name>   Start from a theme (skips the prompt). One of:
                   ${THEMES.map((t) => t.name).join(", ")}
  --list           Print the available themes and exit.
  -h, --help       Show this help.

${bold("Examples")}
  bunx ${REPO.split("/")[1]} my-blog
  bunx ${REPO.split("/")[1]} my-blog --theme cosmic
  bunx ${REPO.split("/")[1]} my-blog --theme custom
`)
}

function printThemes() {
  console.log(`\n${bold("Available themes")}\n`)
  for (const t of THEMES) {
    console.log(`  ${cyan(t.name.padEnd(10))} ${dim(t.blurb)}`)
  }
  console.log(
    `\nLive gallery: https://${REPO.split("/")[0]}.github.io/${REPO.split("/")[1]}/\n`,
  )
}

type Args = { dir?: string; theme?: string; list: boolean; help: boolean }

function parseArgs(argv: string[]): Args {
  const out: Args = { list: false, help: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "-h" || a === "--help") out.help = true
    else if (a === "--list") out.list = true
    else if (a === "--theme") out.theme = argv[++i]
    else if (a.startsWith("--theme=")) out.theme = a.slice("--theme=".length)
    else if (!a.startsWith("-") && !out.dir) out.dir = a
  }
  return out
}

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    }),
  )
}

async function promptTheme(): Promise<Theme> {
  console.log(`\n${bold("Pick a starting theme:")}\n`)
  THEMES.forEach((t, i) => {
    const num = String(i + 1).padStart(2)
    const name = t.name === "custom" ? cyan(t.name.padEnd(10)) : t.name.padEnd(10)
    console.log(`  ${dim(num + ")")} ${name} ${dim(t.blurb)}`)
  })
  const def = THEMES.indexOf(DEFAULT_THEME) + 1
  const answer = (await ask(`\nNumber ${dim(`[${def} = ${DEFAULT_THEME.name}]`)}: `)).trim()
  if (answer === "") return DEFAULT_THEME
  const idx = Number.parseInt(answer, 10) - 1
  if (Number.isNaN(idx) || idx < 0 || idx >= THEMES.length) {
    console.log(dim("  Please enter a number from the list."))
    return promptTheme()
  }
  return THEMES[idx]
}

async function isEmptyDir(dir: string): Promise<boolean> {
  if (!existsSync(dir)) return true
  const entries = await readdir(dir)
  return entries.length === 0
}

async function scaffold(theme: Theme, dir: string) {
  const url = `https://codeload.github.com/${REPO}/tar.gz/refs/heads/${theme.branch}`
  process.stdout.write(dim(`  Fetching ${theme.branch} … `))
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download failed (${res.status}) for ${theme.branch}`)
  const tmp = join(tmpdir(), `laabyb-${Date.now()}.tar.gz`)
  await Bun.write(tmp, res)
  await mkdir(dir, { recursive: true })
  // Strip the top-level <repo>-<branch>/ directory the tarball wraps everything in.
  await Bun.$`tar -xzf ${tmp} -C ${dir} --strip-components=1`.quiet()
  await rm(tmp, { force: true })
  console.log(green("done"))
}

function printNextSteps(theme: Theme, dir: string) {
  if (theme.name === "custom") {
    console.log(`
${green("✓")} Scaffolded ${bold(dir)} on the base theme.

${bold("Now design it with your coding agent")} — run the customize skill with your own prompt:

  ${bold("Claude Code")}
    cd ${dir}
    ${cyan(`claude "/customize make it a warm sepia theme with a serif body font and a single centered column"`)}

  ${bold("Codex")}
    cd ${dir}
    ${cyan(`codex "Follow .agents/skills/customize/SKILL.md — restyle to a warm sepia theme, serif body font, single centered column"`)}

  ${bold("Pi")}
    cd ${dir}
    ${cyan(`pi "Use the customize skill in .agents/skills/customize to make it warm sepia, serif body, single centered column"`)}

  ${bold("Any other agent")}
    Point it at ${cyan("AGENTS.md")} (or ${cyan(".agents/skills/customize/SKILL.md")}) and describe the look you want.

${dim("Tip: edit content first in content/posts/, then let the agent design around it.")}
`)
    return
  }

  console.log(`
${green("✓")} Created ${bold(dir)} ${dim(`(theme: ${theme.name})`)}

  ${cyan("cd " + dir)}
  ${cyan("bun dev")}        ${dim("# build + watch + serve at http://localhost:3000")}

${dim("Customize anytime — open your agent and run /customize.")}
`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) return printUsage()
  if (args.list) return printThemes()

  if (!args.dir) {
    printUsage()
    process.exit(1)
  }

  // Resolve the theme: explicit flag → validated; interactive → prompt;
  // non-interactive with no flag → the documented default (terminal).
  let theme: Theme
  if (args.theme) {
    const found = THEMES.find((t) => t.name === args.theme)
    if (!found) {
      console.error(`\nUnknown theme "${args.theme}". Run with --list to see options.\n`)
      process.exit(1)
    }
    theme = found
  } else if (tty && process.stdin.isTTY) {
    theme = await promptTheme()
  } else {
    theme = DEFAULT_THEME
  }

  const dir = args.dir
  if (!(await isEmptyDir(dir))) {
    console.error(`\nTarget "${dir}" already exists and is not empty. Aborting.\n`)
    process.exit(1)
  }

  console.log()
  await scaffold(theme, dir)

  console.log(dim("  Installing dependencies …"))
  await Bun.$`bun install`.cwd(dir)

  console.log(dim("  Building …"))
  await Bun.$`bun run build`.cwd(dir)

  // Give the adopter a fresh repo to commit into (best-effort).
  await Bun.$`git init -q`.cwd(dir).nothrow().quiet()

  printNextSteps(theme, dir)
}

main().catch((err) => {
  console.error(`\n${err instanceof Error ? err.message : err}\n`)
  process.exit(1)
})
