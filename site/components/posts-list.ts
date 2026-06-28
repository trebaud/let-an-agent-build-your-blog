import type { Post } from "../../core/content"

// Bento grid: first post is featured (spans 2 cols), rest are 1x1 cells
export const renderPostsList = (posts: Post[]) => {
  if (posts.length === 0) return `<p class="no-posts">No posts yet.</p>`

  const [featured, ...rest] = posts

  const featuredDate = new Date(featured.meta.pubDate).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })

  const featuredCell = `<a href="/posts/${featured.slug}" class="bento-cell bento-featured">
    <div class="cell-inner">
      <div class="cell-kicker">Featured</div>
      <h2 class="cell-title">${featured.meta.title}${featured.meta.draft ? ` <span class="draft-badge">draft</span>` : ""}</h2>
      ${featured.meta.description ? `<p class="cell-desc">${featured.meta.description}</p>` : ""}
      <div class="cell-meta">${featuredDate} · ${featured.readingTime} min</div>
    </div>
  </a>`

  const gridCells = rest.map((post, i) => {
    const date = new Date(post.meta.pubDate).toLocaleDateString("en-US", {
      month: "short", day: "numeric",
    })
    const colorClass = `cell-color-${(i % 5) + 1}`
    return `<a href="/posts/${post.slug}" class="bento-cell bento-small ${colorClass}">
      <div class="cell-inner">
        ${post.meta.tags?.[0] ? `<div class="cell-kicker">${post.meta.tags[0]}</div>` : ""}
        <h3 class="cell-title">${post.meta.title}${post.meta.draft ? ` <span class="draft-badge">draft</span>` : ""}</h3>
        ${post.meta.description ? `<p class="cell-desc">${post.meta.description}</p>` : ""}
        <div class="cell-meta">${date} · ${post.readingTime} min</div>
      </div>
    </a>`
  }).join("")

  return `<div class="bento-grid">
    ${featuredCell}
    ${gridCells}
  </div>`
}
