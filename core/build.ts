// Build engine — INVARIANT.
// Orchestrates: load content (./content via core/content) -> render (site/) -> write public/.
// Owns the stable output structure (post URLs, sitemap, RSS). Depends on the content model
// and the presentation layer; neither depends back on this module.

import fs from "node:fs/promises"
import path from "node:path"
import { loadPosts, loadPages } from "./content"
import {
  CONFIG,
  STYLES_SOURCE,
  renderPage,
  renderPostsList,
  renderPostContent,
  buildJsonLd,
} from "../site"

const OUTPUT_DIR = "./public"

async function setupOutputDirectory() {
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true })
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
}

async function copyStatic() {
  // Content assets (post images, downloads) -> /assets/...
  await fs.cp("./content/assets", `${OUTPUT_DIR}/assets`, { recursive: true })
  // Theme stylesheet -> CONFIG.STYLES_HREF
  const cssOut = `${OUTPUT_DIR}${CONFIG.STYLES_HREF}`
  await fs.mkdir(path.dirname(cssOut), { recursive: true })
  await fs.cp(STYLES_SOURCE, cssOut)
  // Site static files (404 page, robots.txt, etc.) -> output root
  await fs.cp("./site/assets", OUTPUT_DIR, { recursive: true })
}

async function generatePages(
  pages: Awaited<ReturnType<typeof loadPages>>,
  posts: Awaited<ReturnType<typeof loadPosts>>
) {
  for (const page of pages) {
    let html = page.html
    if (page.slug === "") html += renderPostsList(posts)

    if (page.slug) await fs.mkdir(`${OUTPUT_DIR}/${page.slug}`)

    await fs.writeFile(
      `${OUTPUT_DIR}/${page.slug}/index.html`,
      renderPage({ path: `/${page.slug}`, title: page.title, description: page.description }, html)
    )
  }
}

async function generateIndividualPosts(posts: Awaited<ReturnType<typeof loadPosts>>) {
  await fs.mkdir(`${OUTPUT_DIR}/posts`, { recursive: true })

  for (const post of posts) {
    await fs.mkdir(`${OUTPUT_DIR}/posts/${post.slug}`)
    const pubDate = post.meta.pubDate ? new Date(post.meta.pubDate).toISOString() : undefined
    await fs.writeFile(
      `${OUTPUT_DIR}/posts/${post.slug}/index.html`,
      renderPage(
        {
          path: `/posts/${post.slug}`,
          title: post.meta.title,
          description: post.meta.description,
          ogType: "article",
          pubDate,
          jsonLd: buildJsonLd(post),
        },
        renderPostContent(post)
      )
    )
  }
}

async function generateSitemap(
  pages: Awaited<ReturnType<typeof loadPages>>,
  posts: Awaited<ReturnType<typeof loadPosts>>
) {
  const now = new Date().toISOString().split("T")[0]

  // Home (slug "") gets top priority; every other page is derived from content/pages.
  const staticUrls = pages.map((page) => ({
    loc: page.slug ? `${CONFIG.BASE_URL}/${page.slug}` : CONFIG.BASE_URL,
    priority: page.slug ? "0.6" : "1.0",
    changefreq: page.slug ? "monthly" : "weekly",
  }))

  const postUrls = posts.map((post) => ({
    loc: `${CONFIG.BASE_URL}/posts/${post.slug}`,
    lastmod: post.meta.pubDate ? new Date(post.meta.pubDate).toISOString().split("T")[0] : now,
    priority: "0.7",
    changefreq: "monthly",
  }))

  const allUrls = [...staticUrls, ...postUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${"lastmod" in u ? u.lastmod : now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

  await fs.writeFile(`${OUTPUT_DIR}/sitemap.xml`, xml)
}

async function generateRssFeed(posts: Awaited<ReturnType<typeof loadPosts>>) {
  const now = new Date().toUTCString()

  const items = posts
    .slice(0, 20)
    .map((post) => {
      const url = `${CONFIG.BASE_URL}/posts/${post.slug}`
      const pubDate = post.meta.pubDate ? new Date(post.meta.pubDate).toUTCString() : now
      const description = post.meta.description ?? ""
      return `    <item>
      <title><![CDATA[${post.meta.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <author>${CONFIG.AUTHOR}</author>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${CONFIG.BLOG_TITLE}</title>
    <link>${CONFIG.BASE_URL}</link>
    <description>${CONFIG.BLOG_SUBTITLE}</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${CONFIG.BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  await fs.writeFile(`${OUTPUT_DIR}/feed.xml`, xml)
}

export async function buildSite() {
  await setupOutputDirectory()
  await copyStatic()

  const [pages, posts] = await Promise.all([loadPages(), loadPosts()])
  await generatePages(pages, posts)
  await generateIndividualPosts(posts)
  await generateSitemap(pages, posts)
  await generateRssFeed(posts)
}
