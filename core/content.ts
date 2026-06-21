// Content engine — INVARIANT.
// Parses content/ into a stable, typed model that the site/ presentation layer renders.
// This module defines the contract between content and presentation:
//   - it reads markdown + frontmatter and emits Post/Page objects
//   - it never produces site HTML (that is the job of site/)
// Changing the shapes below is a breaking change to every theme; treat them as stable.

import fs from "node:fs/promises"
import * as matter from "gray-matter"
import { marked } from "marked"
import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"

// Configure marked with syntax highlighting (content rendering, invariant).
marked.use(
  markedHighlight({
    highlight: (code, lang) => {
      const language = hljs.getLanguage(lang) ? lang : "plaintext"
      return hljs.highlight(code, { language }).value
    },
  })
)

const POSTS_DIR = "./content/posts"
const PAGES_DIR = "./content/pages"
const INCLUDE_DRAFTS = process.env.INCLUDE_DRAFTS === "true"

// ---- Content model (the stable contract) ----

export type PostMeta = {
  title: string
  description?: string
  pubDate: string // ISO date string, normalized from frontmatter `date` or `pubDate`
  tags: string[]
  draft: boolean
}

export type Post = {
  meta: PostMeta
  slug: string
  html: string // rendered post body
  readingTime: number // minutes
}

export type Page = {
  title: string
  description?: string
  slug: string // "" for the home page
  html: string // rendered page body
}

// ---- Helpers ----

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// ---- Loaders ----

export async function loadPosts(): Promise<Post[]> {
  const files = await fs.readdir(POSTS_DIR)

  const posts = await Promise.all(
    files.map(async (file) => {
      const { data, content } = matter.read(`${POSTS_DIR}/${file}`)
      const slug = file.replace(".md", "")
      const html = await marked.parse(content)
      const meta: PostMeta = {
        title: data.title,
        description: data.description,
        pubDate: data.pubDate || data.date,
        tags: Array.isArray(data.tags) ? data.tags : [],
        draft: Boolean(data.draft),
      }
      return { meta, slug, html, readingTime: calculateReadingTime(content) }
    })
  )

  return posts
    .filter((p) => INCLUDE_DRAFTS || !p.meta.draft)
    .sort((a, b) => new Date(b.meta.pubDate).getTime() - new Date(a.meta.pubDate).getTime())
}

export async function loadPages(): Promise<Page[]> {
  const files = await fs.readdir(PAGES_DIR)

  return Promise.all(
    files.map(async (file) => {
      const { data, content } = matter.read(`${PAGES_DIR}/${file}`)
      const fileSlug = file.replace(".md", "")
      if (typeof data.title !== "string") throw new Error(`Missing title in ${file}`)
      return {
        title: data.title,
        description: data.description,
        slug: fileSlug === "home" ? "" : fileSlug,
        html: await marked.parse(content),
      }
    })
  )
}
