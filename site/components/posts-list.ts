import type { Post } from "../../core/content"

export const renderPostsList = (posts: Post[]) => {
  if (posts.length === 0) return `<p class="no-posts">No posts yet.</p>`

  const [featured, ...rest] = posts

  const featuredDate = new Date(featured.meta.pubDate).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  })

  const featuredHtml = `<article class="featured-story">
    <div class="kicker">Top story</div>
    <h2 class="featured-headline"><a href="/posts/${featured.slug}">${featured.meta.title}</a></h2>
    ${featured.meta.description ? `<p class="featured-lede">${featured.meta.description}</p>` : ""}
    <div class="featured-byline">
      <span class="byline-author">By ${featured.meta.draft ? `<span class="draft-badge">draft</span> ` : ""}Staff Writer</span>
      <span class="byline-sep">·</span>
      <time>${featuredDate}</time>
      <span class="byline-sep">·</span>
      <span class="byline-read">${featured.readingTime} min read</span>
    </div>
  </article>`

  const gridItems = rest.map((post) => {
    const date = new Date(post.meta.pubDate).toLocaleDateString("en-US", {
      month: "short", day: "numeric",
    })
    return `<article class="grid-story">
      <div class="kicker">${post.meta.tags?.[0] ?? "Feature"}</div>
      <h3 class="grid-headline"><a href="/posts/${post.slug}">${post.meta.title}${post.meta.draft ? ` <span class="draft-badge">draft</span>` : ""}</a></h3>
      ${post.meta.description ? `<p class="grid-lede">${post.meta.description}</p>` : ""}
      <div class="grid-byline"><time>${date}</time> · ${post.readingTime} min</div>
    </article>`
  }).join("")

  return `<div class="newspaper-layout">
    <div class="main-col">
      ${featuredHtml}
    </div>
    ${rest.length > 0 ? `<div class="stories-grid">${gridItems}</div>` : ""}
  </div>`
}
