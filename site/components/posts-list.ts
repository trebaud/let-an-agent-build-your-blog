import type { Post } from "../../core/content"

export const renderPostsList = (posts: Post[]) => {
  const cards = posts.map((post, i) => {
    const date = new Date(post.meta.pubDate)
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    })
    const tags = post.meta.tags ?? []
    const gradClass = `grad-${(i % 5) + 1}`

    return `<article class="cover-card ${gradClass}">
      <a href="/posts/${post.slug}" class="cover-link">
        <div class="cover-body">
          ${tags.length ? `<div class="cover-tags">${tags.map((t) => `<span class="cover-tag">#${t}</span>`).join("")}</div>` : ""}
          <h2 class="cover-title">${post.meta.title}${post.meta.draft ? ` <span class="draft-badge">draft</span>` : ""}</h2>
          ${post.meta.description ? `<p class="cover-desc">${post.meta.description}</p>` : ""}
          <div class="cover-footer">
            <time class="cover-date">${formattedDate}</time>
            <span class="cover-read">${post.readingTime} min read</span>
          </div>
        </div>
      </a>
    </article>`
  }).join("")

  return `<div class="covers-list">${cards}</div>`
}
