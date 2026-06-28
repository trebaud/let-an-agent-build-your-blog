import type { Post } from "../../core/content"

export const renderPostsList = (posts: Post[]) => {
  const items = posts.map((post, i) => {
    const date = new Date(post.meta.pubDate)
    const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    const day = date.getDate()
    const year = date.getFullYear()
    const side = i % 2 === 0 ? "left" : "right"

    return `<li class="timeline-item timeline-${side}">
      <div class="timeline-card">
        <a href="/posts/${post.slug}" class="timeline-link">
          <h2 class="timeline-title">${post.meta.title}${post.meta.draft ? ` <span class="draft-badge">draft</span>` : ""}</h2>
        </a>
        ${post.meta.description ? `<p class="timeline-desc">${post.meta.description}</p>` : ""}
        <div class="timeline-meta">${month} ${day}, ${year} · ${post.readingTime} min read</div>
        ${post.meta.tags?.length ? `<div class="timeline-tags">${post.meta.tags.map((t) => `<span class="tag">#${t}</span>`).join("")}</div>` : ""}
      </div>
      <div class="timeline-dot">
        <span class="dot-inner"></span>
      </div>
      <div class="timeline-date-bubble">
        <span class="bubble-month">${month}</span>
        <span class="bubble-day">${day}</span>
        <span class="bubble-year">${year}</span>
      </div>
    </li>`
  }).join("")

  return `<div class="timeline-wrap">
    <ul class="timeline">${items}</ul>
  </div>`
}
