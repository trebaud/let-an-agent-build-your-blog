import { CONFIG } from "../site.config"
import { renderNavBar } from "./nav"

export type PageMeta = {
  path: string
  title: string
  description?: string
  canonicalUrl?: string
  ogType?: "website" | "article"
  pubDate?: string
  jsonLd?: string
}

export const renderPage = (meta: PageMeta, content: string) => {
  const {
    path,
    title,
    description = CONFIG.BLOG_SUBTITLE,
    canonicalUrl = `${CONFIG.BASE_URL}${path}`,
    ogType = "website",
    pubDate,
    jsonLd,
  } = meta

  const fullTitle = path === "/" ? CONFIG.BLOG_TITLE : `${title} | ${CONFIG.BLOG_TITLE}`
  const escapedDescription = description.replace(/"/g, "&quot;")
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${fullTitle}</title>
    <meta name="description" content="${escapedDescription}" />
    <meta name="author" content="${CONFIG.AUTHOR}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph -->
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${fullTitle}" />
    <meta property="og:description" content="${escapedDescription}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="${CONFIG.BLOG_TITLE}" />
    ${pubDate ? `<meta property="article:published_time" content="${pubDate}" />` : ""}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${fullTitle}" />
    <meta name="twitter:description" content="${escapedDescription}" />

    <!-- Feeds -->
    <link rel="alternate" type="application/rss+xml" title="${CONFIG.BLOG_TITLE}" href="${CONFIG.BASE_URL}/feed.xml" />

    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${CONFIG.FAVICON_EMOJI}</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
    <script>
      (function () {
        try {
          var t = localStorage.getItem("theme");
          if (t === "dark" || t === "light") document.documentElement.dataset.theme = t;
        } catch (e) {}
      })();
    </script>
    <link rel="stylesheet" href="${CONFIG.STYLES_HREF}">
    ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
    ${CONFIG.ANALYTICS_DOMAIN && CONFIG.ANALYTICS_WEBSITE_ID ? `<script defer src="https://${CONFIG.ANALYTICS_DOMAIN}/script.js" data-website-id="${CONFIG.ANALYTICS_WEBSITE_ID}"></script>` : ""}
  </head>
  <body>
    <div class="page-wrap">
      <header class="masthead">
        <div class="masthead-top">
          <div class="masthead-meta">${today}</div>
          <div class="masthead-meta masthead-tagline">${CONFIG.BLOG_SUBTITLE}</div>
          <div class="masthead-controls">
            <div class="masthead-socials">
              ${CONFIG.SOCIALS.map((s) => `<a href="${s.href}">${s.title}</a>`).join("")}
            </div>
            <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">
              <span class="theme-icon theme-icon-dark">◑</span>
              <span class="theme-icon theme-icon-light">◐</span>
            </button>
          </div>
        </div>
        <div class="masthead-title-row">
          <a href="/" class="masthead-title">${CONFIG.BLOG_BRAND}</a>
        </div>
        <div class="masthead-nav-row">
          ${renderNavBar(path)}
        </div>
      </header>
      <main>
        ${content}
      </main>
      <footer class="site-footer">
        <p>© ${new Date().getFullYear()} ${CONFIG.AUTHOR} · Built with a typed Bun + TypeScript static site generator</p>
      </footer>
    </div>
    <script>
      (function () {
        var btn = document.getElementById("theme-toggle");
        if (!btn) return;
        btn.addEventListener("click", function () {
          var current =
            document.documentElement.dataset.theme ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
          var next = current === "dark" ? "light" : "dark";
          document.documentElement.dataset.theme = next;
          try { localStorage.setItem("theme", next); } catch (e) {}
        });
      })();
    </script>
  </body>
</html>`
}
