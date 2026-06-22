import type { Post } from "../../core/content"

// Editorial / magazine listing: a responsive grid of cards. Each card leads
// with its primary tag as a "category" kicker, then title, excerpt, and byline.
export const renderPostsList = (posts: Post[]) => {
  const cards = posts
    .map(({ meta, slug, readingTime }) => {
      const date = new Date(meta.pubDate)
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      const category = meta.tags[0] ?? "writing"
      return `<li class="post-row">
        <a href="/posts/${slug}" class="post-link">
          <span class="post-kicker">${category}</span>
          <span class="post-title">${meta.title}${
            meta.draft ? ` <span class="draft-badge">draft</span>` : ""
          }</span>
          ${meta.description ? `<p class="post-description">${meta.description}</p>` : ""}
          <span class="post-meta">${formattedDate} · ${readingTime} min read</span>
        </a>
      </li>`
    })
    .join("")

  return `<div class="all-posts"><ul class="posts-list">${cards}</ul></div>`
}
