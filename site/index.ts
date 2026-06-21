// Presentation layer barrel — the single import point the build engine uses to render.
// Everything the site looks like (layout, styling, branding, components) lives under site/.
// Edit these freely to customize the site; the content (../content) and engine (../core)
// stay untouched.

export { CONFIG } from "./site.config"
export type { Link } from "./site.config"
export { renderPage } from "./components/layout"
export type { PageMeta } from "./components/layout"
export { renderPostContent, buildJsonLd } from "./components/post"
export { renderPostsList } from "./components/posts-list"

// Stylesheet source on disk, copied to public by the build engine.
// Its public URL is CONFIG.STYLES_HREF.
export const STYLES_SOURCE = "./site/styles/index.css"
