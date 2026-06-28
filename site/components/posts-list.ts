import type { Post } from "../../core/content"

// Gradients cycle for cover cards
const GRADIENTS = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
  "linear-gradient(135deg, #3d0000 0%, #8b0000 50%, #ff4500 100%)",
  "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1e3a5f 100%)",
  "linear-gradient(135deg, #1a0533 0%, #3d1066 50%, #6b21a8 100%)",
]

export const renderPostsList = (posts: Post[]) => {
  const cards = posts.map((post, i) => {
    const date = new Date(post.meta.pubDate)
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    })
    const gradient = GRADIENTS[i % GRADIENTS.length]
    const tags = post.meta.tags ?? []

    return `<article class="cover-card" style="background: ${gradient};">
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
