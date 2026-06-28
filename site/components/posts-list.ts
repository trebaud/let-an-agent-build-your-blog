import type { Post } from "../../core/content"

export const renderPostsList = (posts: Post[]) => {
  // Group posts by year
  const grouped = posts.reduce((acc, post) => {
    const year = new Date(post.meta.pubDate).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {} as Record<number, Post[]>)

  // Sort years descending
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  const html = years.map((year) => {
    const yearPosts = grouped[year]
    return `<section class="year-section">
      <h2 class="year-heading"><span class="year-label">${year}</span></h2>
      <ul class="posts-list">
        ${yearPosts.map(({ meta, slug, readingTime }) => {
          const date = new Date(meta.pubDate)
          const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
          return `<li class="post-row">
            <a href="/posts/${slug}" class="post-link">
              <span class="post-arrow">$</span>
              <span class="post-title">${meta.title}${meta.draft ? ` <span class="draft-badge">draft</span>` : ""}</span>
              <span class="post-meta">${formattedDate} · ${readingTime} min</span>
            </a>
            ${meta.description ? `<p class="post-description">${meta.description}</p>` : ""}
          </li>`
        }).join("")}
      </ul>
    </section>`
  }).join("")

  return `<div class="all-posts">${html}</div>`
}
