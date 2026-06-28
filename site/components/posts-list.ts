import type { Post } from "../../core/content"

export const renderPostsList = (posts: Post[]) => {
  const items = posts.map(({ meta, slug }, i) => {
    const num = String(i + 1).padStart(2, "0")
    const dateStr = new Date(meta.pubDate).toISOString().slice(0, 10)
    return `<li class="post-row">
      <a href="/posts/${slug}" class="post-link">
        <span class="post-num">${num}</span>
        <span class="post-title">${meta.title}${meta.draft ? ` <span class="draft-badge">draft</span>` : ""}</span>
        <span class="post-dots"></span>
        <span class="post-meta">${dateStr}</span>
      </a>
      ${meta.description ? `<p class="post-description">${meta.description}</p>` : ""}
    </li>`
  }).join("")

  return `<ul class="posts-list">${items}</ul>`
}
