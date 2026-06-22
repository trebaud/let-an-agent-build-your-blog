import { CONFIG } from "../site.config"
import type { Post } from "../../core/content"

export const renderPostContent = (post: Post) => {
  const { meta, html, readingTime } = post
  const date = meta.pubDate ? new Date(meta.pubDate) : null
  const formattedDate = date
    ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : ""
  const tags = meta.tags

  const metaLine = `<div class="post-meta-line">
    ${meta.draft ? `<span class="draft-badge">draft</span>` : ""}
    ${formattedDate ? `<time>${formattedDate}</time>` : ""}
    <span class="post-meta-sep">·</span>
    <span>${readingTime} min read</span>
    ${tags.length ? `<span class="post-tags">${tags.map((t) => `<span class="post-tag">[#${t}]</span>`).join("")}</span>` : ""}
  </div>`

  return `<a href="/" class="post-back">« BACK</a>
<article class="post">
  <header class="post-head">
    <h1>${meta.title}</h1>
    ${metaLine}
  </header>
  ${html}
</article>`
}

export const buildJsonLd = (post: Post): string => {
  const url = `${CONFIG.BASE_URL}/posts/${post.slug}`
  const pubDate = post.meta.pubDate ? new Date(post.meta.pubDate).toISOString() : undefined
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: post.meta.description ?? CONFIG.BLOG_SUBTITLE,
    url,
    datePublished: pubDate,
    author: {
      "@type": "Person",
      name: CONFIG.AUTHOR,
      url: CONFIG.BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: CONFIG.AUTHOR,
      url: CONFIG.BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  })
}
